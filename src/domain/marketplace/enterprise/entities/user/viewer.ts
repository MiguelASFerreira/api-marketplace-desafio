import { User, UserProps } from './user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ViewerProps extends UserProps {}

export class Viewer extends User<ViewerProps> {
  static create(props: ViewerProps, id?: UniqueEntityID) {
    const viewer = new Viewer(
      {
        ...props,
      },
      id,
    )

    return viewer
  }
}
