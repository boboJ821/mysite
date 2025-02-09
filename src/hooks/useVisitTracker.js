import { useEffect, useRef } from 'react';

const API_URL = import.meta.env.PROD 
  ? '/api'  // 修改这里，使用相对路径
  : 'http://localhost:3000/api'; // 开发环境

export const useVisitTracker = () => {
  const visitId = useRef(null);

  useEffect(() => {
    const recordVisit = async () => {
      try {
        const response = await fetch(`${API_URL}/api/visit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            path: window.location.pathname,
          }),
        });
        const data = await response.json();
        visitId.current = data.id;
      } catch (error) {
        console.error('Error recording visit:', error);
      }
    };

    const updateDuration = async () => {
      if (visitId.current) {
        try {
          await fetch(`${API_URL}/api/visit/${visitId.current}`, {
            method: 'PUT',
          });
        } catch (error) {
          console.error('Error updating duration:', error);
        }
      }
    };

    recordVisit();

    // 每分钟更新一次访问时长
    const intervalId = setInterval(updateDuration, 60000);

    // 页面关闭或切换时更新最终时长
    const handleBeforeUnload = () => {
      updateDuration();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateDuration();
    };
  }, []);
}; 