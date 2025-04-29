import Component from "@glimmer/component";
import { service } from "@ember/service";
import { modifier as modifierFn } from "ember-modifier";
import { focusSearchInput } from "discourse/components/search-menu";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class HeaderSearch extends Component {
  @service site;
  @service siteSettings;
  @service currentUser;
  @service appEvents;
  @service router;
  @tracked activeTab = "Forum"; // Add tracked property for activeTab

  constructor() {
    super(...arguments);
    // Subscribe to any activeTab changes
    this.appEvents.on("activeTab:changed", this.handleActiveTabChange);
  }

  willDestroy() {
    super.willDestroy();
    // Clean up event listener
    this.appEvents.off("activeTab:changed", this.handleActiveTabChange);
  }

  @action
  handleActiveTabChange(tabName) {
    this.activeTab = tabName;
  }

  handleKeyboardShortcut = modifierFn(() => {
    const cb = () => focusSearchInput();
    this.appEvents.on("header:keyboard-trigger", cb);
    return () => this.appEvents.off("header:keyboard-trigger", cb);
  });

  get displayForUser() {
    return (
      (this.siteSettings.login_required && this.currentUser) ||
      !this.siteSettings.login_required
    );
  }

  get shouldDisplay() { 
    return (
      this.displayForUser &&
      !this.site.mobileView &&
      !this.args.outletArgs?.topicInfoVisible &&
      this.activeTab === "Forum" // Only display when activeTab is "Forum"
    );
  }
}