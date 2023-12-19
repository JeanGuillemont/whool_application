# whool application

### whool protocol

if you want to get more information on the protocol and check its code please have a look on [protocol repository](https://github.com/JeanGuillemont/whool_protocol/tree/main)

### Summary

The whool application is an onchain url shortener with NFT art on top. It aims to make short url rewarding for their creator, funnier and safer for the visitors by integrating a splash screen before link redirection.

### Description

The whool application is an onchain and NFT powered url shortener allowing the creation and the management of whools. A whool is a string alias NFT mapping to an url selected by its owner and constructing the short url under the following standard : https://whool.art/whool (in this case "whool" is the custom part).

Once clicked the link will lead the user to a splash screen where he will be able to : 
- check the link he is heading to (++ safety)
- discover new nft artworks (++ artists)
- whool owner or protocol owner rewarded on mint (++ reward)

The protocol and its application aim to improve the accessibility of customized short urls and improve the visibility of artists by randomly promoting newly minted NFTs while improving security for the visitor. In return, the protocol owner or the whool owner get referral fee on mints made from the link splash screen.

Any individual or project participating the growth of the protocol either by spreading the word or by creating an application where users create whools, will earn 30% referral fees on any custom whool minted.

### Genesis

The whool protocol is born from a multiple sided statement : 
- The awesome idea of bernatfp is an incredible opportunity to give to users part of the ownership of traffic they create instead of web2 actors
- The risk of hack and scams induced by short urls by hidding destination under a potentially and unmonitored false name, even more in web3 environment
- The difficulty for artists to make their work known outside their community, a growing factor due to the ongoing fragmentation of twitter community
- The current low affordability of web3 customization tools which lower the positive effect on decentralization this customization would bring

### Whools ?

Whool is the mix of of "who" for the actor (user or entity) who create custom links and "wool" representing the links between those actors.

Whools are ERC721 NFT granting the owner to set the url corresponding to it. A whool can be :
- *Random*, in this case it will be a random string and will be free to mint (gas fee still needed). A random whool allow the owner to be referrer in 70% of case.
- *Custom*, in this case creator can choose the string used (if not already existing) and will require a static 0.001eth fee to be minted. A custom whool allow the owner to be referrer in 90% of case.

They are :
- *Affordable* : a custom whool can be minted at the fixed price of 0.001eth (a bit more than $2 at time of writing)
- *Perpetual* : custom or random whools are not rented by the user, once minted user owns his whool fully, forever
- *Transferrable* : the owner of a whool can gift it, transfer it and sell it 
- *1% royalty* : given whool affordability, permanent ownership, a 1% royalty fee on second sales seemed to be fair in case of speculation

### FAQ 

**What is a whool ?**
A whool is an ERC-721 NFT of a custom or random string matching with a predefined url which can be managed by its owner.

They are :
- *Affordable* : a custom whool can be minted at the fixed price of 0.001eth (a bit more than $2 at time of writing)
- *Perpetual* : custom or random whools are not rented by the user, once minted user owns his whool fully, forever
- *Transferrable* : the owner of a whool can gift it, transfer it and sell it 
- *1% royalty* : given whool affordability, permanent ownership, a 1% royalty fee on second sales seemed to be fair in case of speculation

**How to access my whool ?**
In order to access your whool, the easiest way is to go on https://whool.art on "edit" tab and select it, you will be able to copy its link or open it. More generally your whool link is : https://whool.art + your whool NFT name. For example if my whool NFT name is /testWhool, its link would be : https://whool.art/testWhool

**Is it free to mint a whool ?**
Yes, random whool are free to mint, it means you only have to pay gas fee for the transaction and voilà, you will get a whool with a random string like for example: /Op56Ky. 

If you want a customized whool, additionnaly to gas fees, you will be asked to pay a standard fee of 0.001eth to pay for your whool. For this price it will be yours forever and you'll be able to resell it if you don't use it.

**Why would I pay for a custom whool ?**
Custom whool give two benefits : 
- You choose your whool (if available) and own it forever and if you don't use it anymore you can sell it *
- You will get higher chances to get referral rewards if your visitors mint whool or Zora NFT from your short link (90% chances for custom whool vs 70% for random one)

**How does it work ?**
There are 3 main steps in the use of the application : 
- minting your whool by setting a url, if wanted a whool and confirming the transaction to paste your short link everywhere you want
- Your visitors use your short link, go to destination link or mint a Zora NFT or a whool. If visitor mints an NFT or a whool you will be able to get some referral reward in 70% of case for random whool and 90% for custom whool
- You claim your rewards on whool application or on Zora

**How does the whool splash link look  ?**

**Where should I claim my referral rewards ?**
There are 2 place to claim your referral rewards:
- for rewards on whools minted thanks to your whool referral link or from your link(s) splash screen(s), you can claim them on "earn" tab on https://whool.art
- for rewards on Zora NFT minted from your link(s) splash screen(s), you can claim them on Zora's claim page : https://zora.co/manage

**How long do I own a whool ?**
a whool you've minted is yours forever but you can transfer it or sell it.

**Is there a royalty fee on whool ?**
Yes given the low fee to mint custom whools it looked fair to have a 1% royalty fee on whools secondary sales in case of speculation on some of them.

**Is whool protocol a DAO/Is whool protocol decentralized**
For now the whool protocol isn't a DAO nor decentralized for one main reason. Building a DAO before knowing if the protocol will be used would be a bit over engineered, for now there's one owner of the protocol, however in case of success a progressive decentralization would definitely be proposed.

**How to be sure of all this ?**
Both application and [protocol](https://github.com/JeanGuillemont/whool_protocol/tree/main) are opensource so you can monitor that everything claimed is true. For protocol part, in any 

**Is whool application private ?**
Yes only basic analytics are followed thank to dune and [GoatCounter](https://www.goatcounter.com/) with all data available [here](https://whoolapp.goatcounter.com/)

### License

MIT license
