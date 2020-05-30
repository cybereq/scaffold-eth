/* eslint-disable */
import React, { useState } from 'react'
// eslint-disable-next-line
import { Input, Button, Tooltip, Modal, Divider } from 'antd';
import { DollarCircleOutlined } from  '@ant-design/icons';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

export default function Ramp(props) {

  const [ modalUp, setModalUp ] = useState("down")

  const type = "default"

  return (
    <div>
      <Button size="large" shape="round" onClick={()=>{
        setModalUp("up")
      }}>
        <DollarCircleOutlined style={{color:"#52c41a"}}/> {props.price.toFixed(2)}
      </Button>
      <Modal
         title="Buy ETH"
         visible={modalUp==="up"}
         onCancel={()=>{setModalUp("down")}}
         footer={[
            <Button key="back" onClick={()=>{setModalUp("down")}}>
              cancel
            </Button>
          ]}
       >

         <p><Button type={type} size="large" shape="round" onClick={()=>{
           window.open("https://pay.sendwyre.com/purchase?destCurrency=ETH&sourceAmount=25&dest="+props.address)
       // eslint-disable-next-line
         }}>
            <span style={{paddingRight:15}}>🇺🇸</span>Wyre
           </Button></p>
         <p>  <Button type={type} size="large" shape="round" onClick={()=>{
           new RampInstantSDK({
             hostAppName: 'scaffold-eth',
             hostLogoUrl: 'https://scaffoldeth.io/scaffold-eth.png',
             swapAmount: '100000000000000000', // 0.1 ETH in wei  ?
             swapAsset: 'ETH',
             userAddress: props.address,
        // eslint-disable-next-line
           }).on('*', event => console.log(event)).show();
         }}>
            <span style={{paddingRight:15}}>🇬🇧</span>Ramp
           </Button></p>

           <p>
           // eslint-disable-next-line
            <Button type={type} size="large" shape="round" onClick={()=>{window.open("https://www.coinbase.com/buy-ethereum")}}>
              <span style={{paddingRight:15}}>🏦</span>Coinbase
            </Button>
           </p>

           <Divider />

           <p>
            <Button type={type} size="large" shape="round" onClick={()=>{window.open("https://support.mycrypto.com/how-to/getting-started/where-to-get-testnet-ether")}}>
              <span style={{paddingRight:15}}>🛠</span> Testnet Faucets
            </Button>
           </p>

       </Modal>
    </div>
  );
}
