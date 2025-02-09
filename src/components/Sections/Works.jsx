import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

// 动态导入图片
const workImages = Array.from({ length: 10 }, (_, i) => {
  try {
    return new URL(`../../assets/works/work${i + 1}.jpg`, import.meta.url).href;
  } catch (error) {
    console.error(`Error loading image work${i + 1}.jpg:`, error);
    return null;
  }
}).filter(Boolean);

const Works = () => {
  const containerRef = useRef();
  const groupRef = useRef();
  const sectionRef = useRef();
  const [isScrollComplete, setIsScrollComplete] = useState(false);
  const [isAtStart, setIsAtStart] = useState(false);
  const lastScrollY = useRef(0);
  // 添加触摸相关的状态
  const touchStartX = useRef(0);
  const touchStartRotation = useRef(0);
  const isDragging = useRef(false);
  const [selectedWork, setSelectedWork] = useState(null);
  
  useEffect(() => {
    console.log('Works component mounted');
    console.log('Available images:', workImages);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 创建射线投射器用于检测点击
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 创建平面组
    const createPlanes = () => {
      console.log('Creating planes with images:', workImages);
      const group = new THREE.Group();
      
      // 根据屏幕宽度调整平面尺寸
      const isMobile = window.innerWidth < 768;
      const baseWidth = isMobile ? 1920 / 3 : 1920 / 5.5; // 调整移动端画板大小
      const planeWidth = (baseWidth / 1920) * window.innerWidth;
      const planeHeight = planeWidth * 0.75;
      
      const planeGeometry = new THREE.PlaneGeometry(
        planeWidth / 100,
        planeHeight / 100,
        20,
        20
      );

      // 调整圆柱体参数
      const radius = isMobile ? 4 : 8; // 移动端减小半径
      const totalPlanes = workImages.length;
      const angleOffset = (2 * Math.PI) / totalPlanes;

      const textureLoader = new THREE.TextureLoader();
      
      // 创建平面
      workImages.forEach((imagePath, i) => {
        const texture = textureLoader.load(imagePath);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        
        const plane = new THREE.Mesh(planeGeometry, material);
        
        // 计算平面位置
        const angle = i * angleOffset;
        plane.position.x = Math.cos(angle) * radius;
        plane.position.z = Math.sin(angle) * radius;
        
        plane.rotation.y = -angle + Math.PI / 2;
        
        // 弯曲平面
        const vertices = plane.geometry.attributes.position;
        for (let j = 0; j < vertices.count; j++) {
          const x = vertices.getX(j);
          const y = vertices.getY(j);
          const z = vertices.getZ(j);
          
          const normalizedX = x / (planeWidth / 10);
          const curveFactor = isMobile ? 0.001 : 0.1; // 移动端增加弯曲程度
          
          const bendZ = -(normalizedX * normalizedX) * curveFactor;
          
          const newX = x;
          const newZ = z + bendZ;
          
          const radialOffset = isMobile ? 0.001 : 0.001;
          const finalZ = newZ - Math.abs(normalizedX) * radialOffset;
          
          vertices.setXYZ(j, newX, y, finalZ);
        }
        
        vertices.needsUpdate = true;
        plane.geometry.computeVertexNormals();
        
        group.add(plane);
      });

      return group;
    };

    try {
      groupRef.current = createPlanes();
      scene.add(groupRef.current);
    } catch (error) {
      console.error('Error creating planes:', error);
    }
    
    // 调整相机位置
    const isMobile = window.innerWidth < 768;
    camera.position.z = isMobile ? 3 : 7; // 移动端相机距离改为4
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    // 调整动画速度
    let rotationSpeed = isMobile ? 0.0005 : 0.001; // 移动端进一步减慢旋转速度
    let targetRotation = 0;

    // 修改滚动处理函数
    const handleScroll = () => {
      if (!groupRef.current || !sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const sectionHeight = rect.height;
      
      const scrollingUp = window.scrollY < lastScrollY.current;
      lastScrollY.current = window.scrollY;

      const sectionProgress = (viewHeight - rect.top) / (sectionHeight + viewHeight);
      const progress = Math.max(0, Math.min(1, sectionProgress));

      if (rect.top <= viewHeight && rect.bottom >= 0) {
        if (isAtStart && scrollingUp) {
          setIsScrollComplete(true);
          return;
        }

        // 调整移动端的旋转幅度
        const rotationAmount = isMobile ? Math.PI / 16 : Math.PI / 8; // 减小移动端旋转幅度
        
        if (scrollingUp) {
          targetRotation += rotationAmount;
        } else {
          targetRotation -= rotationAmount;
        }

        gsap.to(groupRef.current.rotation, {
          y: targetRotation,
          duration: isMobile ? 0.6 : 1, // 进一步缩短移动端动画时间
          ease: 'power2.out',
        });

        // 检查是否到达起始位置
        if (progress < 0.1) {
          setIsAtStart(true);
        } else {
          setIsAtStart(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // 添加触摸事件处理
    const handleTouchStart = (e) => {
      if (!groupRef.current) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartRotation.current = groupRef.current.rotation.y;
      isDragging.current = true;
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current || !groupRef.current) return;
      
      const touchX = e.touches[0].clientX;
      const deltaX = touchX - touchStartX.current;
      
      // 将触摸移动距离转换为旋转角度（添加负号反转方向）
      const rotationSensitivity = 0.005;
      const newRotation = touchStartRotation.current - deltaX * rotationSensitivity; // 这里添加负号
      
      // 使用GSAP实现平滑旋转
      gsap.to(groupRef.current.rotation, {
        y: newRotation,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: true
      });
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    // 只在移动端添加触摸事件监听
    if (window.innerWidth < 768) {
      containerRef.current?.addEventListener('touchstart', handleTouchStart);
      containerRef.current?.addEventListener('touchmove', handleTouchMove);
      containerRef.current?.addEventListener('touchend', handleTouchEnd);
    }

    // 修改动画循环，在拖动时暂停自动旋转
    const animate = () => {
      requestAnimationFrame(animate);
      
      // 只在非拖动状态下执行自动旋转
      if (groupRef.current && !isDragging.current) {
        groupRef.current.rotation.y += rotationSpeed;
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // 响应式处理
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.position.z = newIsMobile ? 4 : 7; // 更新这里的相机距离
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // 重新创建平面组以适应新尺寸
      scene.remove(groupRef.current);
      groupRef.current = createPlanes();
      scene.add(groupRef.current);
    };

    window.addEventListener('resize', handleResize);

    // 处理点击事件
    const handleClick = (event) => {
      if (isDragging.current) return; // 如果正在拖动则不处理点击

      // 计算鼠标位置
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // 更新射线
      raycaster.setFromCamera(mouse, camera);

      // 检测相交的对象
      const intersects = raycaster.intersectObjects(groupRef.current.children);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const workIndex = groupRef.current.children.indexOf(clickedMesh);
        
        // 点击动画效果
        gsap.to(clickedMesh.scale, {
          x: 1.1,
          y: 1.1,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
          onComplete: () => {
            setSelectedWork(workIndex);
          }
        });
      }
    };

    // 处理触摸点击
    const handleTouchClick = (e) => {
      if (Math.abs(e.changedTouches[0].clientX - touchStartX.current) < 5) {
        handleClick(e.changedTouches[0]);
      }
    };

    // 添加点击事件监听
    containerRef.current?.addEventListener('click', handleClick);
    containerRef.current?.addEventListener('touchend', handleTouchClick);

    // 修改清理函数，移除触摸事件监听
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (window.innerWidth < 768) {
        containerRef.current?.removeEventListener('touchstart', handleTouchStart);
        containerRef.current?.removeEventListener('touchmove', handleTouchMove);
        containerRef.current?.removeEventListener('touchend', handleTouchEnd);
      }
      containerRef.current?.removeChild(renderer.domElement);
      containerRef.current?.removeEventListener('click', handleClick);
      containerRef.current?.removeEventListener('touchend', handleTouchClick);
    };
  }, [isAtStart]);

  // 处理作品详情的显示
  const handleCloseDetail = () => {
    setSelectedWork(null);
  };

  return (
    <section 
      id="works" 
      ref={sectionRef}
      className={`relative ${isScrollComplete ? 'h-screen' : 'h-[200vh]'}`}
      style={{ zIndex: 1 }}
    >
      <div className={`${
        isScrollComplete ? 'relative' : 'sticky'
      } top-0 h-screen`}>
        <div 
          className="absolute inset-0" 
          ref={containerRef}
          style={{ touchAction: 'none' }}
        ></div>
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-8 pt-20">作品展示</h2>
        </div>

        {/* 作品详情弹窗 */}
        {selectedWork !== null && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={handleCloseDetail}
          >
            <div 
              className="relative bg-white rounded-lg p-6 m-4 max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={handleCloseDetail}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img 
                src={workImages[selectedWork]} 
                alt={`Work ${selectedWork + 1}`}
                className="w-full h-auto rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                作品 {selectedWork + 1}
              </h3>
              <p className="text-gray-600">
                这是作品 {selectedWork + 1} 的详细描述。
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Works; 