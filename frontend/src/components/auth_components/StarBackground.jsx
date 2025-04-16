import { useState, useEffect } from "react";
import Star from "./Star";

const StarBackground = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 50; i++) {
        // sonar-disable-next-line javascript:S1528
        const top = Math.random() * 90; // 0-90vh to avoid clipping
        // sonar-disable-next-line javascript:S1528
        const delay = Math.random() * 5; // 0-5s for livelier start
        // sonar-disable-next-line javascript:S1528
        const duration = Math.random() * 6 + 6; // 6-12s
        // sonar-disable-next-line javascript:S1528
        const width = Math.random() * 7.5 + 5; // 5-12.5em

        newStars.push({
          id: i,
          top,
          delay,
          duration,
          width,
        });
      }
      setStars(newStars);
    };
    generateStars();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-screen -rotate-45 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <Star
          key={star.id}
          top={star.top}
          delay={star.delay}
          duration={star.duration}
          width={star.width}
        />
      ))}
    </div>
  );
};

export default StarBackground;