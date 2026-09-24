import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import defaultPhoto from "../../assets/photo.jpeg";

export default function AboutMe({
  isOpen = true,
  onClose = () => {},
  zIndex = 50,
  onFocus = () => {},
  data = {},
}) {
  const [flipped, setFlipped] = useState(false);

  const photo = data?.photoUrl || defaultPhoto;
  const name = data?.name || "Eaint Mon Mon Kyi";
  const subtitle = data?.subtitle || "ICT Student & Creative Developer";
  const email = data?.email || "eaintmonmonkyi2@gmail.com";
  const website = data?.website || "portfolio.os";
  const idNumber = data?.idNumber || "ID #2026";
  const backHeader = data?.backHeader || "PERSONNEL FILE // ABOUT ME";
  const bio =
    data?.bio ||
    "Third-year Information & Communication Technology undergraduate specializing in interactive software, front-end architecture, and applied AI systems. Passionate about retro UI design, responsive interactive web canvases, and tactile micro-interactions.";
  const status = data?.status || "Status: Available for hire";

  const springDrop = {
    type: "spring",
    stiffness: 110,
    damping: 14,
    mass: 0.9,
  };

  const springRecoilExit = {
    type: "spring",
    stiffness: 140,
    damping: 15,
    mass: 0.8,
  };

  return (
    <AnimatePresence onExitComplete={() => setFlipped(false)}>
      {isOpen && (
        <div
          className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden select-none"
          style={{
            zIndex,
            fontFamily: "'Courier New', monospace",
          }}
        >
          {/* Lanyard Strap / Black Band Dropping from top */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "55vh", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              enter: springDrop,
              exit: { ...springRecoilExit, delay: 0.05 },
            }}
            className="absolute top-0 w-8 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-950 shadow-2xl z-10 border-x border-neutral-700"
          />

          {/* Dropping Lanyard Assembly & Card */}
          <motion.div
            onMouseDown={onFocus}
            initial={{ y: "-100vh", opacity: 0, rotate: -4 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{
              y: "-110vh",
              opacity: 0,
              rotate: 5,
              transition: springRecoilExit,
            }}
            transition={springDrop}
            className="relative z-20 pointer-events-auto flex flex-col items-center mt-12"
          >
            {/* Lanyard Clip Attachment */}
            <div className="flex flex-col items-center z-30">
              <div className="w-10 h-10 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500 rounded-t-lg border border-zinc-600 shadow-md flex items-center justify-center">
                <div className="w-3 h-5 bg-zinc-700 rounded-full opacity-60" />
              </div>
              <div className="w-5 h-3 bg-zinc-400 border-x-2 border-zinc-600 -mt-0.5" />
            </div>

            {/* Flip Card Container */}
            <div
              style={{
                width: "480px",
                height: "290px",
                perspective: "1200px",
                cursor: "pointer",
              }}
              onClick={() => setFlipped((f) => !f)}
              className="-mt-1 relative group"
            >
              {/* Close Button ("X") */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                title="Dismiss Card"
                className="absolute -top-3 -right-3 z-40 w-7 h-7 bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95"
              >
                ✕
              </button>

              {/* Inner Wrapper for 3D Flip */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* FRONT SIDE: Namecard */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    backgroundColor: "#ffffff",
                    border: "3px solid #808080",
                    boxShadow: "10px 10px 0px rgba(0,0,0,0.35)",
                    padding: "24px 30px",
                    display: "flex",
                    alignItems: "center",
                    gap: "28px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      width: "130px",
                      height: "130px",
                      borderRadius: "50%",
                      border: "4px solid #000080",
                      overflow: "hidden",
                      flexShrink: 0,
                      backgroundColor: "#e0e0e0",
                    }}
                  >
                    <img
                      src={photo}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div style={{ textAlign: "left", flex: 1 }}>
                    <div
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        color: "#808080",
                        fontWeight: "bold",
                        marginBottom: "4px",
                      }}
                    >
                      HELLO, MY NAME IS
                    </div>
                    <h1
                      style={{
                        fontSize: "26px",
                        fontWeight: "900",
                        color: "#000080",
                        margin: "0 0 6px 0",
                        lineHeight: 1.1,
                      }}
                    >
                      {name}
                    </h1>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#404040",
                        margin: "0 0 14px 0",
                      }}
                    >
                      {subtitle}
                    </p>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#555555",
                        borderTop: "1px dashed #c0c0c0",
                        paddingTop: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                      }}
                    >
                      <span>📧 {email}</span>
                      <span>🌐 {website}</span>
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#999",
                        marginTop: "8px",
                        textAlign: "right",
                      }}
                    >
                      [click to flip ↵]
                    </div>
                  </div>
                </div>

                {/* BACK SIDE: About Me Details */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    backgroundColor: "#f4f4f4",
                    border: "3px solid #808080",
                    boxShadow: "10px 10px 0px rgba(0,0,0,0.35)",
                    padding: "24px 28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between border-b-2 border-neutral-300 pb-2 mb-3">
                      <span className="text-xs font-bold text-blue-900 tracking-wider">
                        {backHeader}
                      </span>
                      <span className="text-[10px] text-neutral-400">{idNumber}</span>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
                      {bio}
                    </p>
                  </div>

                  <div className="border-t border-dashed border-neutral-300 pt-2 flex justify-between items-center text-[10px] text-neutral-500">
                    <span>{status}</span>
                    <span className="italic">[click to flip back ↵]</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}