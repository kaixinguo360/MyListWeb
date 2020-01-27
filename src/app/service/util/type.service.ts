import {ComponentFactory, ComponentFactoryResolver, Injectable, Type} from '@angular/core';

import {TypeConfig} from '../../type/type-config';
import {PreviewCard} from '../../com/card/preview/preview-card';
import {DetailCard} from '../../com/card/detail/detail-card';
import {Node} from '../node.service';

export interface TypeInfo {
  name: string;
  id: string;
  preview: Type<PreviewCard>;
  detail: Type<DetailCard>;
  icon: string;
  ext?: RegExp;
}

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  types: Map<string, TypeInfo> = new Map<string, TypeInfo>();

  public addType(info: TypeInfo) {
    this.types.set(info.id, info);
  }
  public getType(id: string): TypeInfo {
    return this.types.get(
      this.types.has(id) ? id : 'default'
    );
  }

  public getPreviewCardFactory(node: Node): ComponentFactory<PreviewCard> {
    return this.componentFactoryResolver.resolveComponentFactory(this.getType(node.mainData.type).preview);
  }
  public getDetailCardFactory(node: Node): ComponentFactory<DetailCard> {
    return this.componentFactoryResolver.resolveComponentFactory(this.getType(node.mainData.type).detail);
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
    TypeConfig.forEach(type => this.addType(type));
  }
}
