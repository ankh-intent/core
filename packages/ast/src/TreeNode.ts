import { Region } from '@intent/source';

export interface TreeNode {
    node: string;
    astRegion: Region;
    children: TreeNode[];
}
