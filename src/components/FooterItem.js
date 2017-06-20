import React from 'react';
import { object, string } from 'prop-types';

const FooterItem = ({ title, link }) => (
   <div>
       <p className="title">{title}:</p>
       <p><a href={link.url}>{link.text}</a></p>
   </div>
);

const propTypes = {
   title: string.isRequired,
   link: object.isRequired
};


export default FooterItem;
