import {ListContentComponent} from './content/list-content.component';
import {ListEditComponent} from './edit/list-edit.component';
import {TypeInfo} from '../../service/util/type.service';

export const ListType: TypeInfo = {
  id: 'list',
  name: 'List',
  preview: ListContentComponent,
  detail: ListContentComponent,
  extraEdit: ListEditComponent,
  icon: 'collections',
  process: node => {
    node.extraList.forEach(image => {
      if (image.status === 'new') {
        image.node.mainData.permission = node.mainData.permission;
        image.node.mainData.nsfw = node.mainData.nsfw;
        image.node.mainData.like = node.mainData.like;
        image.node.mainData.hide = node.mainData.hide;
        image.node.mainData.sourceUrl = node.mainData.sourceUrl;
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
    return true;
  },
};
