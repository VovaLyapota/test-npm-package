import{j as S}from"./jsx-runtime-D_zvdyIk.js";var r=(e=>(e.RED="red",e.GREEN="green",e.BLUE="blue",e))(r||{});const B=({color:e,...O})=>S.jsx("button",{style:{color:e},...O,children:"New Super-duper component button"});B.__docgenInfo={description:"",methods:[],displayName:"Button",props:{color:{required:!0,tsType:{name:"COLORS"},description:""}}};const{fn:_}=__STORYBOOK_MODULE_TEST__,x={title:"Components/Button",component:B,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{color:{control:"select",options:["red","green","blue"],description:"Text color of the button"},disabled:{control:"boolean"},onClick:{action:"clicked"}},args:{onClick:_()}},o={args:{color:r.RED}},s={args:{color:r.GREEN}},t={args:{color:r.BLUE}},a={args:{color:r.BLUE,disabled:!0}};var n,c,d;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    color: COLORS.RED
  }
}`,...(d=(c=o.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var l,p,u;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    color: COLORS.GREEN
  }
}`,...(u=(p=s.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var i,m,g;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    color: COLORS.BLUE
  }
}`,...(g=(m=t.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var E,R,b;a.parameters={...a.parameters,docs:{...(E=a.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    color: COLORS.BLUE,
    disabled: true
  }
}`,...(b=(R=a.parameters)==null?void 0:R.docs)==null?void 0:b.source}}};const C=["Red","Green","Blue","Disabled"];export{t as Blue,a as Disabled,s as Green,o as Red,C as __namedExportsOrder,x as default};
