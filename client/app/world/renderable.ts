//Imports
import { TILE_SIZE } from "../../../build/constants.ts"
import { Render } from "../render.ts"
import { Positionable } from "./positionable.ts"

/**
 * World renderable element.
 * A positionable object with a sprite.
 */
export abstract class Renderable extends Positionable {
  /** Sprite */
  abstract readonly sprite: ReturnType<typeof Render.Container>

  /** Rendered flag */
  rendered = false

  /** Destroyed flag */
  destroyed = false

  /** Debug sprite */
  protected _debug: ReturnType<typeof Render.Graphics> | null

  /** Render method */
  protected abstract render(): void

  /** Hide sprite */
  hide() {
    this.sprite.visible = false
  }

  /** Show sprite (call render method if needed) */
  show() {
    if (this.destroyed)
      return
    if (!this.rendered) {
      this.rendered = true
      this.render()
    }
    this.sprite.visible = true
    this.debug()
  }

  /** Toggle sprite visibilitu */
  toggle() {
    return this.sprite.visible ? this.hide() : this.show()
  }

  /** Debug sprite */
  protected debug(visible = false) {
    if (this._debug) {
      this._debug.visible = visible
      this._debug.position.set(this.x * TILE_SIZE, this.y * TILE_SIZE)
    }
  }

  /** Destructor */
  destructor() {
    this.destroyed = true
    this.rendered = false
    this.sprite.visible = false
    this.sprite.removeChildren()
    this.debug(false)
    this._debug?.parent.removeChild(this._debug)
  }
}
