/* jshint strict: true */
/* eslint-disable import/first */

import React from 'react';
import {MadmenCols} from "../service/MadmenService";
import Card from './Card';

function List(Props: any) {
    const madmenList = Props.madmenList;
    return (
        <div>
            {madmenList.map((r: MadmenCols) => (
                <div key={'div-card-'+r.id} id={'card-'+r.id} className={"card"}>
                    <Card key={'card-'+r.id} r={r}/>
                </div>
            ))}
        </div>
    );
}

export default List;
