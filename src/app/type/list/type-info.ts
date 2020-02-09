import {ListPreviewComponent} from './preview/list-preview.component';
import {ListEditComponent} from './edit/list-edit.component';
import {TypeInfo, TypeService} from '../../service/util/type.service';
import {ListDetailComponent} from './detail/list-detail.component';

export const ListType: TypeInfo = {
  id: 'list',
  name: 'List',
  preview: ListPreviewComponent,
  detail: ListDetailComponent,
  extraEdit: ListEditComponent,
  icon: 'collections',
  process: node => {
    node.extraList.forEach(n => {
      if (n.status !== 'exist') {
        n.node.mainData.permission = node.mainData.permission;
        n.node.mainData.nsfw = node.mainData.nsfw;
        n.node.mainData.like = node.mainData.like;
        n.node.mainData.hide = node.mainData.hide;
        n.node.mainData.source = node.mainData.source;
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
        excerpt: 'unknown node',
        count: 0,
      });
    }
  },
};
