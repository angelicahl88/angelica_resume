import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Graph from './components/Graph';
import ListItem from './components/ListItem';
import FooterItem from './components/FooterItem';

export default class App extends Component {
   static PropTypes : {
      data: PropTypes.shape
   }

   constructor() {
      super();
   }

   _renderGithubLink() {
      return (
         <a href="https://github.com/geoshepherds" target="_blank">
             <div className="gitHub"></div>
             <p className="bold git">View projects on <span className="lower">GitHub &gt;</span></p>
         </a>
      )
   }

   _renderParagraph(textArr) {
      return textArr.map(textItem => {
         return (
            <p key={textItem.id} dangerouslySetInnerHTML={{__html: textItem.text}}></p>
         )
      })
   }

   _renderUl(listArray) {
      return (
         <ul>
            {
               listArray.map(listItem => {
                  return (
                     <ListItem
                        key={ listItem.id }
                        item={ listItem }
                     />
                  )
               })
            }
         </ul>
      );
   }

   _renderGraph(graphData) {
      return (
         <Graph graphData={ graphData } />
      )
   }

   render() {
      return (
         <div className="App">
            <header className="intro">
                <div>
                    <h1 className="courier">
                        Angelica Hart Lindh
                    </h1>
                    <h4 className="upper">
                        Interactive Resumé
                    </h4>
                </div>
            </header>

            {
               Object.keys(this.props.data.sections).map(section => {
                  const sectionData = this.props.data.sections[section];

                  return (
                     <div
                        className="container"
                        key={sectionData.Id}
                     >
                         <div className="left">
                             <h5 className="upper">{sectionData.sectionName}</h5>
                         </div>
                         <div className={`right ${sectionData.specialClass}`}>
                             <h5 className="upper bold">
                                 {sectionData.title}
                             </h5>
                             {
                                sectionData.body.type === 'paragraph' ? this._renderParagraph(sectionData.body.content) :
                                sectionData.body.type === 'ul' ? this._renderUl(sectionData.body.content) :
                                sectionData.body.type === 'imagelink' ? this._renderGithubLink() :
                                sectionData.body.type === 'graph' ? this._renderGraph(sectionData.body.content) :
                                null
                             }
                         </div>
                     </div>
                  )

               })
            }

            <footer>
                {
                   this.props.data.footer.map(item => (
                         <FooterItem
                           key={ item.title }
                           title={ item.title }
                           link={ item.link }
                        />
                     ))
                }
            </footer>
         </div>
    );
  }
}
