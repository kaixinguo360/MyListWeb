import {ComponentFactory, ComponentFactoryResolver, Injectable, Type} from '@angular/core';

import {TypeConfig} from '../../type/type-config';
import {PreviewCard} from '../../com/card/preview/preview-card';
import {DetailCard} from '../../com/card/detail/detail-card';
import {ExtraEdit} from '../../com/extra-edit/extra-edit';
import {Node} from '../node.service';

export interface TypeInfo {
  name: string;
  id: string;
  preview: Type<PreviewCard>;
  detail: Type<DetailCard>;
  extraEdit: Type<ExtraEdit>;
  icon: string;
  ext?: RegExp;
  process?: (node: Node) => any;
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

  public getPreviewCardFactory(type: string): ComponentFactory<PreviewCard> {
    return this.componentFactoryResolver.resolveComponentFactory(this.getType(type).preview);
  }
  public getDetailCardFactory(type: string): ComponentFactory<DetailCard> {
    return this.componentFactoryResolver.resolveComponentFactory(this.getType(type).detail);
  }
  public getExtraEditFactory(type: string): ComponentFactory<ExtraEdit> {
    return this.componentFactoryResolver.resolveComponentFactory(this.getType(type).extraEdit);
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
    TypeConfig.forEach(type => this.addType(type));
  }
}
