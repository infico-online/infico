import {  useState, useEffect  } from "react";
import {  logger  } from "@/lib/logger";

const useAdminMonitoring = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMonitoringData = async () => {
    try {
      const response = await fetch('/api/admin/monitoring');
      if (!response.ok) throw new Error('Failed to fetch monitoring data');
      const monitoringData = await response.json();
      setData(monitoringData);
    } catch (error) {
      logger.error('AdminMonitoring', 'Failed to fetch monitoring data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
    // Обновляем каждую минуту
    const interval = setInterval(fetchMonitoringData, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    loading,
    refetch: fetchMonitoringData
  };
};
