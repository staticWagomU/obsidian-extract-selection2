import { App, PluginSettingTab, Setting } from "obsidian";
import DailyZettelPlugin from "./main";

export interface DailyZettelSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: DailyZettelSettings = {
	mySetting: "default",
};

export class DailyZettelSettingTab extends PluginSettingTab {
	plugin: DailyZettelPlugin;

	constructor(app: App, plugin: DailyZettelPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Settings #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
