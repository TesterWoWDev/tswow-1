/*
 * This file is part of tswow (https://github.com/tswow)
 *
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
import { CellWrapper } from './CellWrapper';
import { CPrim } from './Cell';
import { PendingCell } from './PendingCell';


export class CellWrapperExists<D extends CPrim, T> extends CellWrapper<D, T> implements PendingCell {
    exists() {
        const cell = this.cell as any;
        if (cell.exists && typeof (cell.exists) === 'function') {
            return cell.exists();
        }
        return false;
    }
}
