import {ComponentFactory, ComponentFactoryResolver, Injectable, Type} from '@angular/core';

import {Node} from './node.service';
import {TypeInfos} from '../type/type-infos';
import {ContentPreview} from '../type/content-preview';
import {ContentDetail} from '../type/content-detail';

export interface TypeInfo {
  name: string;
  id: string;
  preview: Type<ContentPreview>;
  detail: Type<ContentDetail>;
  icon: string;
  ext?: RegExp;
}

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  public resolveContentPreviewFactory(node: Node): ComponentFactory<any> {
    return this.componentFactoryResolver.resolveComponentFactory(this.resolveTypeInfo(node).preview);
  }

  public resolveContentDetailFactory(node: Node): ComponentFactory<any> {
    return this.componentFactoryResolver.resolveComponentFactory(this.resolveTypeInfo(node).detail);
  }

  public resolveTypeInfo(node: Node): TypeInfo {
    if (TypeInfos.has(node.mainData.type)) {
      return TypeInfos.get(node.mainData.type);
    } else {
      const ext = node.mainData.title.trim().split('.').pop().toLowerCase();
      let typeInfo: TypeInfo;
      TypeInfos.forEach(info => {
        if (!typeInfo && info.ext && info.ext.exec(ext)) {
          typeInfo = info;
        }
      });
      if (!typeInfo) { // Unknown File
        const defaultInfo = TypeInfos.get('default');
        const extInfo = this.resolveExt(ext);
        typeInfo = {
          id: defaultInfo.id,
          name: extInfo.name,
          icon: extInfo.icon,
          preview: defaultInfo.preview,
          detail: defaultInfo.detail,
        };
      }
      return typeInfo;
    }
  }

  public resolveExt(ext: string): { icon: string, name: string } {
    if (/^(aif|cda|mid|midi|mp3|mpa|ogg|wav|wma|wpl)$/.exec(ext)) {
      return { icon: 'music_video', name: 'Audio File' };
    } else if (/^(7z|arj|deb|pkg|rar|rpm|tar|gz|z|zip)$/.exec(ext)) {
      return { icon: 'account_balance_wallet', name: 'Compressed File' };
    } else if (/^(dmg|iso|toast|vcd)$/.exec(ext)) {
      return { icon: 'album', name: 'Disc File' };
    } else if (/^(csv|dat|db|dbf|log|mdb|sav|sql|tar|xml)$/.exec(ext)) {
      return { icon: 'ballot', name: 'Data File' };
    } else if (/^(apk|bat|bin|cgi|com|exe|gadget|jar|py|wsf)$/.exec(ext)) {
      return { icon: 'extension', name: 'Executable File' };
    } else if (/^(fnt|fon|otf|ttf)$/.exec(ext)) {
      return { icon: 'font_download', name: 'Font File' };
    } else if (/^(jpg|jpeg|jfif|pjpeg|pjp|png|gif|bmp|webp|apng|ico|cur|svg|ai|ps|psd|tif|tiff)$/.exec(ext)) {
      return { icon: 'image', name: 'Image File' };
    } else if (/^(asp|aspx|cer|cfm|cgi|pl|css|htm|html|js|jsp|part|php|py|rss|xhtml)$/.exec(ext)) {
      return { icon: 'description', name: 'Internet File' };
    } else if (/^(c|class|cpp|cs|h|java|sh|swift|vbW)$/.exec(ext)) {
      return { icon: 'description', name: 'Programming File' };
    } else if (/^(bak|cab|cfg|cpl|cur|dll|dmp|drv|icns|ico|ini|lnk|msi|sys|tmp)$/.exec(ext)) {
      return { icon: 'settings_applications', name: 'System File' };
    } else if (/^(3g2|3gp|avi|flv|h264|m4v|mkv|mov|mp4|mpg|rm|vob|wmv|rmvb|asf|divx|mpeg|mpe)$/.exec(ext)) {
      return { icon: 'videocam', name: 'Video File' };
    } else if (/^(doc|docx|odt|pdf|rtf|tex|txt|wks|wps|wpd)$/.exec(ext)) {
      return { icon: 'book', name: 'Text File' };
    } else {
      return { icon: 'insert_drive_file', name: 'Unknown File' };
    }
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }
}
