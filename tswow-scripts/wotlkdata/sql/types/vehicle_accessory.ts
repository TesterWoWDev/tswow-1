/*
  * Copyright (C) 2020 tswow <https://github.com/tswow/>
  * This program is free software: you can redistribute it and/or
  * modify it under the terms of the GNU General Public License as
  * published by the Free Software Foundation, version 3.
  *
  * This program is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  * See the GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with this program. If not, see <https://www.gnu.org/licenses/>.
  */

/* tslint:disable */
import { mediumint , tinyint , text , int } from '../../primitives'
import { SqlRow } from '../SQLRow'
import { SqlTable } from '../SQLTable'
import { Relation } from '../../query/Relations'
import { SQLCell, SQLCellReadOnly } from '../SQLCell'
import { PrimaryKey } from '../../table/PrimaryKey'

 /** 
  * Main row definition
  * - Add column comments to the commented getters below
  * - Add file comments to DBCFiles.ts
  */
export class vehicle_accessoryRow extends SqlRow<vehicle_accessoryCreator,vehicle_accessoryQuery> {
    /**
     * Primary Key
     * 
     * No comment (yet!)
     */
    @PrimaryKey()
    get guid() {return new SQLCellReadOnly<mediumint, this>(this, 'guid')}
    
    /**
     * No comment (yet!)
     */
    get accessory_entry() {return new SQLCell<mediumint, this>(this, 'accessory_entry')}
    
    /**
     * Primary Key
     * 
     * No comment (yet!)
     */
    @PrimaryKey()
    get seat_id() {return new SQLCellReadOnly<tinyint, this>(this, 'seat_id')}
    
    /**
     * No comment (yet!)
     */
    get minion() {return new SQLCell<tinyint, this>(this, 'minion')}
    
    /**
     * No comment (yet!)
     */
    get description() {return new SQLCell<text, this>(this, 'description')}
    
    /**
     * No comment (yet!)
     */
    get summontype() {return new SQLCell<tinyint, this>(this, 'summontype')}
    
    /**
     * No comment (yet!)
     */
    get summontimer() {return new SQLCell<int, this>(this, 'summontimer')}
    
    /**
     * Creates a clone of this row with new primary keys.
     * 
     * Cloned rows are automatically added to the SQL table.
     */ 
    clone(guid : mediumint,seat_id : tinyint, c? : vehicle_accessoryCreator) : this {
        return this.cloneInternal([guid,seat_id],c)
    }
}

/**
 * Used for object creation (Don't comment these)
 */
export type vehicle_accessoryCreator = {
    guid? : mediumint,
    accessory_entry? : mediumint,
    seat_id? : tinyint,
    minion? : tinyint,
    description? : text,
    summontype? : tinyint,
    summontimer? : int,
}

/**
 * Used for object queries (Don't comment these)
 */
export type vehicle_accessoryQuery = {
    guid? : Relation<mediumint>,
    accessory_entry? : Relation<mediumint>,
    seat_id? : Relation<tinyint>,
    minion? : Relation<tinyint>,
    description? : Relation<text>,
    summontype? : Relation<tinyint>,
    summontimer? : Relation<int>,
}

/**
 * Table definition (specifies arguments to 'add' function)
 * - Add file comments to SQLFiles.ts
 */
export class vehicle_accessoryTable extends SqlTable<
    vehicle_accessoryCreator,
    vehicle_accessoryQuery,
    vehicle_accessoryRow> {
    add(guid : mediumint,seat_id : tinyint, c? : vehicle_accessoryCreator) : vehicle_accessoryRow {
        const first = this.first();
        if(first) return first.clone(guid,seat_id,c)
        else return this.rowCreator(this, {}).clone(guid,seat_id,c)
    }
}

/**
 * Table singleton (Object used by 'SQL' namespace)
 * - Add file comments to SQLFiles.ts
 */
export const SQL_vehicle_accessory = new vehicle_accessoryTable(
    'vehicle_accessory',
    (table, obj)=>new vehicle_accessoryRow(table, obj))