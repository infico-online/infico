export const pageTransitions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 }
};

export const navTransitions = {
  visible: { y: 0, opacity: 1 },
  hidden: { y: 100, opacity: 0 },
  transition: { duration: 0.3 }
};
