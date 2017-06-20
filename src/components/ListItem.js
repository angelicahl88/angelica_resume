import React from 'react';
import { object } from 'prop-types';

const ListItem = ({ item }) => (
   <li>
      <p>
          {item.years}
      </p>
      <div>
          <p className="bold">{item.name}</p>
          <p>{item.details}</p>
          {
             item.link ?
             <a href={item.link.url} target="_blank">
                <p className="bold cred">{item.link.text}</p>
            </a>
            : null
          }
      </div>
   </li>
);

const propTypes = {
   item: object.isRequired
};


export default ListItem;
