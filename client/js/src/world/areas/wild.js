//Imports
  import Area from "./area.js"
  import u from "../../app/utils.js"

/** 
 * World wild area.
 */
  export default class Wild extends Area {

    //World instancied creatures reference
      creatures = new Set()

    //Species in wild area (associated to spawn probability)
      species = {}

    //Constructor
      constructor() {
        //Heritage
          super(...arguments)
      }

    //Load
      async load() {
        //Heritage
          await super.load(...arguments)
        //Load species probabilities
          const species = Object.keys(this.properties).filter(property => Wild.species.property.test(property))
          let p = 0
          for (let name of species) {
            const dp = this.properties[name]
            this.species[`${p}-${p+dp}`] = name.replace(Wild.species.property, "")
            p = dp
          }
        //Spawn parameters
          this.spawns = {
            max:{creatures:this.properties.max_creatures||this.area.size/8},
            probability:0.4
          }
      }

    //Update
      async update() {
        //Heritage
          await super.update(...arguments)
        //Add creature if possible
          if ((this.creatures.size < this.spawns.max.creatures)&&(Math.random() < this.spawns.probability)) {
            //Generate a species
              let species = null
              const r = Math.random()
              for (let p in this.species) {
                const [a, b] = p.split("-").map(Number)
                if ((a < r)&&(r < b)) {
                  species = this.species[p]
                  break
                }
              }
            //Generate spawn point
              let x = NaN, y = NaN, spawns = u.shuffle(this.area.tiled)
              for (let spawn of spawns)
                if (this.inside({x:spawn[0], y:spawn[1]})) {
                  [x, y] = spawn
                  break
                }
            //Create creature
              if ((species)&&(Number.isFinite(x))&&(Number.isFinite(y))) {
                const creature = this.world.add.creature({species, x, y, area:this})
                this.creatures.add(creature)
              }
          }
        //Wander
          this.creatures.forEach(creature => creature.update())
      }

    //Reset
      reset() {
        //Heritage
          super.reset()
        //Clear instantiated creatures
          this.creatures.forEach(creature => creature.destroy())
          this.creatures.clear()
      }

    //Species variable
      static species = {
        //Property associated to species
          property:/^pk_/
      }

  }