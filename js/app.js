"use strict";

const modal = document.querySelector("#contact-modal");
const openModal = document.querySelector("#contact-btn");
const closeModal = document.querySelector("#contact-close");

openModal.addEventListener("click", () => {
  modal.showModal();
});

closeModal.addEventListener("click", () => {
  modal.close();
});
