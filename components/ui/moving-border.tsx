// "use client";
// import React from "react";
// import {
//   motion,
//   useAnimationFrame,
//   useMotionTemplate,
//   useMotionValue,
//   useTransform,
// } from "motion/react";
// import { useRef } from "react";
// import { cn } from "@/lib/utils";

// export function Button({
//   borderRadius = "1.75rem",
//   children,
//   as: Component = "button",
//   containerClassName,
//   borderClassName,
//   duration,
//   className,
//   ...otherProps
// }: {
//   borderRadius?: string;
//   children: React.ReactNode;
//   as?: any;
//   containerClassName?: string;
//   borderClassName?: string;
//   duration?: number;
//   className?: string;
//   [key: string]: any;
// }) {
//   return (
//     <Component
//       className={cn(
//         "bg-transparent relative text-xl  h-16 w-40 p-[1px] overflow-hidden ",
//         containerClassName
//       )}
//       style={{
//         borderRadius: borderRadius,
//       }}
//       {...otherProps}
//     >
//       <div
//         className="absolute inset-0"
//         style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
//       >
//         <MovingBorder duration={duration} rx="30%" ry="30%">
//           <div
//             className={cn(
//               "h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]",
//               borderClassName
//             )}
//           />
//         </MovingBorder>
//       </div>

//       <div
//         className={cn(
//           "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
//           className
//         )}
//         style={{
//           borderRadius: `calc(${borderRadius} * 0.96)`,
//         }}
//       >
//         {children}
//       </div>
//     </Component>
//   );
// }

// export const MovingBorder = ({
//   children,
//   duration = 2000,
//   rx,
//   ry,
//   ...otherProps
// }: {
//   children: React.ReactNode;
//   duration?: number;
//   rx?: string;
//   ry?: string;
//   [key: string]: any;
// }) => {
//   const pathRef = useRef<any>();
//   const progress = useMotionValue<number>(0);

//   useAnimationFrame((time) => {
//     const length = pathRef.current?.getTotalLength();
//     if (length) {
//       const pxPerMillisecond = length / duration;
//       progress.set((time * pxPerMillisecond) % length);
//     }
//   });

//   const x = useTransform(
//     progress,
//     (val) => pathRef.current?.getPointAtLength(val).x
//   );
//   const y = useTransform(
//     progress,
//     (val) => pathRef.current?.getPointAtLength(val).y
//   );

//   const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

//   return (
//     <>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         preserveAspectRatio="none"
//         className="absolute h-full w-full"
//         width="100%"
//         height="100%"
//         {...otherProps}
//       >
//         <rect
//           fill="none"
//           width="100%"
//           height="100%"
//           rx={rx}
//           ry={ry}
//           ref={pathRef}
//         />
//       </svg>
//       <motion.div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           display: "inline-block",
//           transform,
//         }}
//       >
//         {children}
//       </motion.div>
//     </>
//   );
// };
"use client";

import type React from "react";
import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl h-16 w-40 p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    if (!pathRef.current) return;

    // SVG rect doesn't have getTotalLength by default, so we need to calculate it
    // For a rect, the perimeter is 2 * (width + height)
    const rect = pathRef.current.getBoundingClientRect();
    const length = 2 * (rect.width + rect.height);

    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  // Calculate position along the perimeter
  const position = useMotionValue({ x: 0, y: 0 });

  useAnimationFrame(() => {
    if (!pathRef.current) return;

    const rect = pathRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const perimeter = 2 * (width + height);
    const currentProgress = progress.get();

    // Calculate position along the perimeter
    let x = 0;
    let y = 0;

    if (currentProgress < width) {
      // Top edge: moving right
      x = currentProgress;
      y = 0;
    } else if (currentProgress < width + height) {
      // Right edge: moving down
      x = width;
      y = currentProgress - width;
    } else if (currentProgress < 2 * width + height) {
      // Bottom edge: moving left
      x = width - (currentProgress - (width + height));
      y = height;
    } else {
      // Left edge: moving up
      x = 0;
      y = height - (currentProgress - (2 * width + height));
    }

    position.set({ x, y });
  });

  const x = useTransform(position, (pos) => pos.x);
  const y = useTransform(position, (pos) => pos.y);

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
