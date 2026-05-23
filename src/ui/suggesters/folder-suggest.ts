import { AbstractInputSuggest, App, TFolder } from "obsidian";

export class FolderSuggest extends AbstractInputSuggest<TFolder> {
	private readonly textInputEl: HTMLInputElement;

	constructor(app: App, inputEl: HTMLInputElement) {
		super(app, inputEl);
		this.textInputEl = inputEl;
	}

	protected getSuggestions(query: string): TFolder[] {
		return this.app.vault
			.getAllLoadedFiles()
			.filter((file): file is TFolder => file instanceof TFolder)
			.filter((folder) => folder.path.toLowerCase().includes(query.toLowerCase()));
	}

	renderSuggestion(folder: TFolder, el: HTMLElement): void {
		el.setText(folder.path);
	}

	selectSuggestion(folder: TFolder, _evt: MouseEvent | KeyboardEvent): void {
		this.setValue(folder.path);
		this.textInputEl.dispatchEvent(new Event("input"));
		this.close();
	}
}
