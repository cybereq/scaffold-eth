/* eslint-disable */
import React, { UseState } from 'react';
import { ethers } from "ethers";
import { Card, Row, Col, List, Input, Button } from 'antd';
import { DownloadOutlined, UploadOutlined, CloseCircleOutlined, CheckCircleOutlined, RocketOutlined, SafetyOutlined } from '@ant-design/icons';
import { useContractLoader, UseContractReader, useEventListener, useBlockNumber, useBalance, UseTimestamp } from "./hooks"
import { Transactor } from "./helpers"
import { Address, Balance, Timeline, AddressInput } from "./components"
const { Meta } = Card;
const contractName = "SmartContractWallet"

const protocol = require('https');
const PORT = process.env.PORT || 3000

export default function SmartContractWallet(props) {

  const tx = Transactor(props.injectedProvider,props.gasPrice)

  const localBlockNumber = useBlockNumber(props.localProvider)
  const localBalance = useBalance(props.address,props.localProvider)

  const readContracts = useContractLoader(props.localProvider);
  const writeContracts = useContractLoader(props.injectedProvider);

  const limit = useContractReader(readContracts,contractName,"limit",1777);
  const friends = useContractReader(readContracts,contractName,"friends",[props.address],1777);
  const friendUpdates = useEventListener(readContracts,contractName,"UpdateFriend",props.localProvider,1);
  const owner = useContractReader(readContracts,contractName,"owner",1777);

  const contractAddress = readContracts?readContracts[contractName].address:""
  const contractBalance = useBalance(contractAddress,props.localProvider)

  const [ friendAddress, setFriendAddress ] = useState("")
  

  const [ recoveryAddress, setRecoveryAddress ] = useState("")
  const CurrentRecoveryAddress = useContractReader(readContracts,contractName,"recoveryAddress",1777);
  const TimeToRecover = useContractReader(readContracts,contractName,"TimeToRecover",1777);  
  const LocalTimestamp = useTimestamp(props.localProvider)
  const IsFriend = useContractReader(readContracts,contractName,"friends",[props.address],1777);

  const updateFriend = (isFriend)=>{
     return ()=>{
       tx(writeContracts['SmartContractWallet'].updateFriend(friendAddress, isFriend))
       setFriendAddress("")
     }


    }
/*
    Notice the structure of the code for calling a function on our contract:
    *contract*.*functionname*( *args* ) all wrapped in a tx() so we can track 
    transaction progress. You can also await this tx() function to get the 
    resulting hash, status, etc.

**/

var https = require('https');

var fs = require('fs');

var httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/kuaminika.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/kuaminika.com/fullchain.pem'),
  dhparam: fs.readFileSync("/sslcert/dh-strong.pem")
};
server = require( 'https' ).createServer( hostOptions, app );}
 /*   


  let ownerDisplay = []
if(props.address==owner){
 ownerDisplay.push(
   <Row align="middle" gutter={4}>
     <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Friend:</Col>
     <Col span={10}>
       <AddressInput
         value={friendAddress}
         ensProvider={props.ensProvider}
         onChange={(address)=>{setFriendAddress(address)}}
       />
     </Col>
     <Col span={6}>
       <Button style={{marginLeft:4}} onClick={updateFriend(true)} shape="circle" icon={<CheckCircleOutlined />} />
       <Button style={{marginLeft:4}} onClick={updateFriend(false)} shape="circle" icon={<CloseCircleOutlined />} />
     </Col>
   </Row>
 )
 ownerDisplay.push(
  <Row align="middle" gutter={4}>
    <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Recovery:</Col>
    <Col span={10}>
      <AddressInput
        value={recoveryAddress}
        ensProvider={props.ensProvider}
        onChange={(address)=>{
          setRecoveryAddress(address)
        }}
      />
    </Col>
    <Col span={6}>
      <Button style={{marginLeft:4}} onClick={()=>{
        tx(writeContracts['SmartContractWallet'].setRecoveryAddress(recoveryAddress))
        setRecoveryAddress("")
      }} shape="circle" icon={<CheckCircleOutlined />} />

      {TimeToRecover&&TimeToRecover.toNumber()>0 ? (
  <Button style={{marginLeft:4}} onClick={()=>{
    tx( writeContracts['SmartContractWallet'].cancelRecover() )
  }} shape="circle" icon={<CloseCircleOutlined />}/>
):""}
{currentRecoveryAddress && currentRecoveryAddress!="0x0000000000000000000000000000000000000000"?(
  <span style={{marginLeft:8}}>
    <Address
      minimized={true}
      value={currentRecoveryAddress}
      ensProvider={props.ensProvider}
    />
  </span>
):""}
    </Col>
  </Row>
 )
 }else if(isFriend){
  let recoverDisplay = (
    <Button style={{marginLeft:4}} onClick={()=>{
      tx( writeContracts['SmartContractWallet'].friendRecover() )
    }} shape="circle" icon={<SafetyOutlined />}/>
  )
  if(LocalTimestamp&&TimeToRecover.toNumber()>0){
    const secondsLeft = TimeToRecover.sub(LocalTimestamp).toNumber()
    if(secondsLeft>0){
      recoverDisplay = (
        <div>
          {secondsLeft+"s"}
        </div>
      )
    }else{
      recoverDisplay = (
        <Button style={{marginLeft:4}} onClick={()=>{
          tx( writeContracts['SmartContractWallet'].recover() )
        }} shape="circle" icon={<RocketOutlined />}/>
      )
    }
  }
  ownerDisplay = (
    <Row align="middle" gutter={4}>
      <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Recovery:</Col>
      <Col span={16}>
        {recoverDisplay}
      </Col>
    </Row>
  )

}
  let cardActions = []
  if(props.address==owner){
    cardActions = [
      <div onClick={()=>{
        tx(writeContracts['SmartContractWallet'].withdraw())
      }}>
        <UploadOutlined /> Withdraw
      </div>,
      <div onClick={()=>{
        tx({
          to: contractAddress,
          value: ethers.utils.parseEther('0.001'),
        })
      }}>
        <DownloadOutlined /> Deposit
      </div>,
    ]
  }

  let display
  if(readContracts && readContracts[contractName]){
    display = (
      <div>
        <Row align="middle" gutter={4}>
          <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>
            Deployed to:
          </Col>
          <Col span={16}>
            <Address value={contractAddress} />
          </Col>
        </Row>
        <Row align="middle" gutter={4}>
          <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>
            Owner:
          </Col>
          <Col span={16}>
            <Address value={owner} onChange={(newOwner)=>{
              tx(writeContracts['SmartContractWallet'].updateOwner(newOwner))
            }}/>
          </Col>
        </Row>
        {ownerDisplay}
      </div>
    )
  }

  return (
    <div>
      <Card
        title={(
          <div>
            📄 Smart Contract Wallet with Recovery
            <div style={{float:'right',opacity:owner?0.77:0.33}}>
              <Balance
                address={contractAddress}
                provider={props.localProvider}
                dollarMultiplier={props.price}
              />
            </div>
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={!owner}
        actions={cardActions}>
          <Meta
            description={(
              <div>
                {display}
              </div>
            )}
          />
      </Card>

      <List
        style={{ width: 550, marginTop: 25}}
        header={<div><b>Friend Updates</b></div>}
        bordered
        dataSource={friendUpdates}
        renderItem={item => (
          <List.Item style={{ fontSize:22 }}>
            <Address 
              ensProvider={props.ensProvider} 
              value={item.friend}
              /> {item.isFriend?"✅":"❌"}
            </List.Item>
          )}
        />

      <div style={{position:'fixed',textAlign:'right',right:25,top:90,padding:10,width:"50%"}}>
        <h1><span role="img" aria-label="checkmark">✅</span> TODO LIST</h1>
        <Timeline
          localProvider={props.localProvider}
          address={props.address}
          chainIsUp={typeof localBlockNumber != "undefined"}
          hasOwner={typeof owner != "undefined"}
          hasEther={parseFloat(localBalance)>0}
          contractAddress={contractAddress}
          contractHasEther={parseFloat(contractBalance)>0}
          amOwnerOfContract={owner===props.address}
          hasLimit={limit&&limit.toNumber()>0}
          hasFriends={typeof friends != "undefined"}
          hasFriendEvents={typeof friendUpdates != "undefined" && friendUpdates.length > 0}
          hasRecovery={typeof recoveryAddress != "undefined" && typeof currentRecoveryAddress != "undefined" }
        />
      </div>
    </div>
  );

}
