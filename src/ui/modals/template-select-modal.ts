import { App, FuzzySuggestModal } from "obsidian";
import type { ExtractionTemplate } from "../../types/settings";

export class TemplateSelectModal extends FuzzySuggestModal<ExtractionTemplate> {
	private templates: ExtractionTemplate[];
	private onSelect: (template: ExtractionTemplate) => void;

	constructor(
		app: App,
		templates: ExtractionTemplate[],
		onSelect: (template: ExtractionTemplate) => void,
	) {
		super(app);
		this.templates = templates;
		this.onSelect = onSelect;
	}

	getItems(): ExtractionTemplate[] {
		// Sort templates by order property
		return this.templates.slice().sort((a, b) => a.order - b.order);
	}

	getItemText(template: ExtractionTemplate): string {
		// Include name, description, and icon in searchable text
		const parts = [template.name];
		if (template.description) {
			parts.push(template.description);
		}
		if (template.icon) {
			parts.push(template.icon);
		}
		return parts.join(" ");
	}

	onChooseItem(
		template: ExtractionTemplate,
		_evt: MouseEvent | KeyboardEvent,
	): void {
		this.onSelect(template);
	}
}
