import {ComponentFactory, ComponentFactoryResolver, Injectable, Type} from '@angular/core';
import {Preview} from '../component/node-content/preview/preview';
import {Detail} from '../component/node-content/detail/detail';
import {ExtraEdit} from '../component/node-edit/extra-edit/extra-edit';
import {DefaultType, TypeConfig} from '../type/type-config';
import {QuickEdit} from '../component/node-edit/quick-edit/quick-edit';
import {Node} from './node.service';

export interface TypeDefinition {
  id: string;
  name: string;
  icon: string;
  openInNewTab: boolean;
  preview: Type<Preview>;
  detail: Type<Detail>;
  extraEdit?: Type<ExtraEdit>;
  quickEdit?: Type<QuickEdit>;
  process?: (node: Node) => void;
}

@Injectable({
    providedIn: 'root'
})
export class TypeService {

  public static instance: TypeService;
  public static defaultType = DefaultType;
  public static typeInfos = TypeConfig;

  private types: Map<string, TypeDefinition> = new Map<string, TypeDefinition>();

  public getPreviewCardFactory(typeId: string): ComponentFactory<Preview> {
    return this.componentFactoryResolver.resolveComponentFactory(this.getType(typeId).preview);
  }

  public getDetailCardFactory(typeId: string): ComponentFactory<Detail> {
    return this.componentFactoryResolver.resolveComponentFactory(this.getType(typeId).detail);
  }

  public getExtraEditFactory(typeId: string): ComponentFactory<ExtraEdit> {
    const type = this.getType(typeId);
    return type.extraEdit ? this.componentFactoryResolver.resolveComponentFactory(type.extraEdit) : null;
  }

  public getQuickEditFactory(typeId: string): ComponentFactory<QuickEdit> {
    const type = this.getType(typeId);
    return type.quickEdit ? this.componentFactoryResolver.resolveComponentFactory(type.quickEdit) : null;
  }

  public process(node: Node) {
    const type = this.getType(node.mainData.type);
    if (type && type.process) {
      type.process(node);
    }
  }

  public getType(typeId: string): TypeDefinition {
    return this.types.has(typeId) ? this.types.get(typeId) : TypeService.defaultType;
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    TypeService.instance = this;
    TypeService.typeInfos.forEach(type => this.types.set(type.id, type));
  }
}
