import {ListPreviewComponent} from './preview/list-preview.component';
import {ListEditComponent} from './edit/list-edit.component';
import {TypeDefinition, TypeService} from '../../service/type.service';
import {ListDetailComponent} from './detail/list-detail.component';

export const ListType: TypeDefinition = {
  id: 'list',
  name: 'List',
  openInNewTab: true,
  preview: ListPreviewComponent,
  detail: ListDetailComponent,
  extraEdit: ListEditComponent,
  icon: 'list',
  process: node => {
    node.extraList.forEach(n => {
      if (n.status === 'new') {
        n.node.mainData.permission = node.mainData.permission;
        n.node.mainData.nsfw = node.mainData.nsfw;
        n.node.mainData.like = node.mainData.like;
        n.node.mainData.hide = node.mainData.hide;
        n.node.mainData.source = node.mainData.source;
      }
      if (n.status !== 'exist') {
        TypeService.instance.process(n.node);
      }
    });
    if (node.extraList.length) {
      const mainNode = node.extraList[0].node;
      node.mainData.excerpt = JSON.stringify({
        type: mainNode.mainData.type,
        excerpt: mainNode.mainData.excerpt,
        count: node.extraList.length,
      });
    } else {
      node.mainData.excerpt = JSON.stringify({
        type: 'node',
        excerpt: 'Empty List',
        count: 0,
      });
    }
  },
};
