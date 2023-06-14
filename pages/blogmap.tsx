import * as React from 'react'
import { GetStaticProps } from 'next'
import ReactDOM from 'react-dom';
import { useEffect, useRef, useState  } from 'react';
import ReactFlow, { Background, MarkerType, Controls,useNodesState,useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { NotionAPI } from 'notion-client'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { PageProps, Params } from '@/lib/types'


const defaultViewport = { x: 0, y: 0 };


export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const domain = 'cafe-pied-nu.vercel.app'

  // resolveNotionPage('cafe-pied-nu.vercel.app', "e27e8d4f-90f6-4a74-8149-20cb6e28c03a").then( (zxc) => {
  //   console.log("asadadd",zxc)
  // })
  const rawPageId = "e27e8d4f90f64a74814920cb6e28c03a" //context.params.pageId as string

  // const rawPageId =  "7d5f2b9f0877456589a38132c7d3552c" // brewing

  // const api = new NotionAPI() 
  // const testreturn = await api.getPage(rawPageId)
  // console.log("testreturn",testreturn)
  // console.log("tt",testreturn.block['cc03d81b-e3c6-4e50-bd74-2e817764e37a'].value)
  // console.log("tt",testreturn.block['ec962e14-f609-48a1-bdd0-362b3dc0ea39'].value)
  // console.log("tt",testreturn.block['d9ba4c6e-8992-4506-99e9-343ba88ad141'].value)
  // console.log("tt",testreturn.block['e9dac57f-6bb8-48f5-8c0b-cd3b0191e0bd'].value)
  // console.log("tt_title",testreturn.block['e9dac57f-6bb8-48f5-8c0b-cd3b0191e0bd'].value.properties.title)
  // console.log("tt",testreturn.block['d3b4162e-4e62-4b8d-b2c9-281aa688f84f'].value)
  
  // console.log("tt",testreturn.block['cc03d81b-e3c6-4e50-bd74-2e817764e37a'].value.properties.title)

  // api.getPage('843eaeeb-a80f-4908-987b-9bf24e44c831').then( (zxc) => {
  //   console.log("asadadd",zxc)
  // })

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    
    // console.log("headersBlocks",headersBlocks[0][1])
    // console.log("asdasdasd",props)
    // console.log("zxcszxc",typeof(props.recordMap.block))
    // const prop_types = props.recordMap.block.filter((x)=> (x.type === 'text'))
    // console.log("asdtypes",prop_types)
    // console.log("asdasdasd",props.recordMap.block['cc03d81b-e3c6-4e50-bd74-2e817764e37a'])

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function CafeGraphPage (props) {

  const datablocks = Object.values(props.recordMap.block).map((x)=>(x.value))

  const headersBlocks = datablocks.filter((x)=>(x.type.includes("header") && x.id !== '11b1fdc3-5977-4694-965c-0a0ff7b26cbe')).map((x)=>(
    
    {'id': x.id,
    'title': x.properties.title.map(
      (y) => (y[0].trim())
    ).join(' ')
    }
  ))

  // console.log("datablocks",datablocks[0])
  // datablocks = datablocks
  console.log("datablocks",datablocks)
  console.log("headersBlocks",headersBlocks)

  // const initialNodes = [
  //   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' },sourcePosition: 'right',},
  //   { id: '2', position: { x: 200, y: 0 }, data: { label: '2' },targetPosition: 'left', },
  //   // { id: '3', position: { x: 0, y: 200 }, data: { label: '3' } ,parentNode: '1'},
  // ];

  const initialNodes = headersBlocks.map(
    (x,_index) => {
      let ret = 
        {
          'id': x.id,
          'position':{
            'x': 200 * _index,
            'y':0
          },
          'data':{
            'label' : x.title,
          },
          'deletable': false,
          'sourcePosition' : 'right', 
          'targetPosition' : 'left',
          'style':{
            'size':'50px'
          }
        }
        if (_index == 0) {
          ret['type'] = 'input'
        }
        if (_index == headersBlocks.length -1) {
          ret['type'] = 'output'
        }
      return ret
        
    }
  )
  console.log(initialNodes)
  const initialEdges = initialNodes.slice(0,-1).map(
    (_node,_index)=>(
      {
        "id": '_node.id' + '_' + initialNodes[_index+1].id,
        'source': _node.id,
        'target': initialNodes[_index+1].id,
        'markerEnd': {
          'type': MarkerType.Arrow,
        }, 
        'style': {
          'strokeWidth': 2.5,
          // stroke: '#FF0072',
        },
      }

    )
  )
  
  // [
  //   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' },sourcePosition: 'right',},
  //   { id: '2', position: { x: 200, y: 0 }, data: { label: '2' },targetPosition: 'left', },
  //   // { id: '3', position: { x: 0, y: 200 }, data: { label: '3' } ,parentNode: '1'},
  // ];

  // const initialEdges = [
  //   { id: 'e1-2', source: '1', target: '2',
  //           markerEnd: {
  //             type: MarkerType.Arrow,
  //           }, 
  //           style: {
  //             strokeWidth: 5,
  //             // stroke: '#FF0072',
  //           },
            
  //           }];
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // const api = new NotionAPI() 
  // api.getPage('843eaeeb-a80f-4908-987b-9bf24e44c831').then( (zxc) => {
  //   console.log("asadadd",zxc)
  // })


  
  


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={false}
        edgesFocusable={false}
        nodesConnectable={false}
        // defaultViewport={defaultViewport}
        fitView
        > 
        
        <Controls
          showInteractive={false}
        /></ReactFlow> 
    </div>
      )
  
}

// export default function NotionDomainPage(props) {
//   return (
//     <div>
//       <script>
        
//       </script>
//       <h1>asd</h1>
//       <div id='cy'></div>
//     </div>
//   )
// }
