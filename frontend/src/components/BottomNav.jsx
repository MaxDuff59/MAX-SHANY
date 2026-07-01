import React from "react";
import "./BottomNav.css";

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      <button
        type="button"
        className={`bottom-nav__item bottom-nav__item--courses ${
          active === "courses" ? "is-active" : ""
        }`}
        onClick={() => onChange("courses")}
        aria-current={active === "courses" ? "page" : undefined}
      >
        <CartIcon />
        <span>Courses</span>
      </button>
      <button
        type="button"
        className={`bottom-nav__item bottom-nav__item--todos ${
          active === "todos" ? "is-active" : ""
        }`}
        onClick={() => onChange("todos")}
        aria-current={active === "todos" ? "page" : undefined}
      >
        <ChecklistIcon />
        <span>À faire</span>
      </button>
    </nav>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.6 12.2a1.8 1.8 0 0 0 1.77 1.4h8.4a1.8 1.8 0 0 0 1.76-1.42L21 8H6" />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3.5 6 1.6 1.6L7.8 4.8" />
      <path d="M11 6h9.5" />
      <path d="m3.5 13 1.6 1.6 2.7-2.8" />
      <path d="M11 13h9.5" />
      <path d="m3.5 20 1.6 1.6 2.7-2.8" />
      <path d="M11 20h9.5" />
    </svg>
  );
}
