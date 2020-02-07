import {ComponentFactory, ComponentFactoryResolver, Injectable, Type} from '@angular/core';
import {Preview} from '../../component/content/preview/preview';
import {Detail} from '../../component/content/detail/detail';
import {ExtraEdit} from '../../component/extra-edit/extra-edit';
import {Node} from './node';
import {DefaultType, TypeConfig} from '../../type/type-config';

export interface TypeInfo {
  id: string;
  name: string;
  icon: string;
  preview: Type<Preview>;
  detail: Type<Detail>;
  extraEdit: Type<ExtraEdit>;
  process?: (node: Node) => void;
}

@Injectable({
    providedIn: 'root'
})
export class TypeService {

  public static type: TypeService;
  public static defaultType = DefaultType;
  public static typeInfos = TypeConfig;

  private types: Map<string, TypeInfo> = new Map<string, TypeInfo>();

  public getPreviewCardFactory(type: string): ComponentFactory<Preview> {
    return this.componentFactoryResolver.resolveComponentFactory(this.getType(type).preview);
  }

  public getDetailCardFactory(type: string): ComponentFactory<Detail> {
    return this.componentFactoryResolver.resolveComponentFactory(this.getType(type).detail);
  }

  public getExtraEditFactory(type: string): ComponentFactory<ExtraEdit> {
    return this.componentFactoryResolver.resolveComponentFactory(this.getType(type).extraEdit);
  }

  public process(node: Node) {
    const type = this.getType(node.mainData.type);
    if (type && type.process) {
      type.process(node);
    }
  }

  public getType(id: string): TypeInfo {
    return this.types.has(id) ? this.types.get(id) : TypeService.defaultType;
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    TypeService.type = this;
    TypeService.typeInfos.forEach(type => this.types.set(type.id, type));
  }
}
