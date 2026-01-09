import { Notice, TFile } from "obsidian";
import { StructureSuggestModal } from "../ui/modals/structure-suggest-modal";
import { FrontmatterService } from "../services/frontmatter-service";
import type DailyZettelPlugin from "../main";

export async function linkPermanent(plugin: DailyZettelPlugin): Promise<void> {
	// 1. 現在のアクティブファイルを取得
	const file = plugin.app.workspace.getActiveFile();

	if (!file || !(file instanceof TFile)) {
		new Notice("⚠️ ノートを開いてください");
		return;
	}

	// 2. 現在のノートタイプを確認
	const frontmatterService = new FrontmatterService(plugin.app);
	const currentType = await frontmatterService.getNoteType(file);

	if (currentType !== "permanent") {
		new Notice("⚠️ permanent note のみ接続できます");
		return;
	}

	// 3. StructureSuggestModal で Structure Note を選択
	const modal = new StructureSuggestModal(
		plugin.app,
		plugin.settings,
		file,
		(structureFile: TFile | null) => {
			if (structureFile) {
				void (async () => {
					await plugin.connectionManager.linkPermanentToStructure(file, structureFile);
					new Notice(`✅ ${structureFile.basename} に接続しました`);
				})();
			}
		},
	);

	modal.open();
}
