import { Reactive, reactive } from "vue";

interface UI {
  showHeader: Boolean;
  showNavbar: Boolean;
  show(): void;
  hide(): void;
}

export const UI: Reactive<UI> = reactive<UI>({
  showNavbar: false,
  showHeader: false,
  show() {
    this.showNavbar = true;
    this.showHeader = true;
  },
  hide() {
    this.showNavbar = false;
    this.showHeader = false;
  },
});