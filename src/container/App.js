import React, {Component, Fragment} from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import {Label, Button, Input, FormGroup, Col, Row} from 'reactstrap';
import GoogleTranslate from 'google-translate';
import Select from 'react-select';
class App extends Component {
    constructor() {
        super();
        this.state = {
            exportFileName: "",
            fileChosen: null,
            fileContent: "",
            key: new Array(),
            listLanguage:[],
            targetLanguage: "zh",
        }

        this.translator = GoogleTranslate('AIzaSyDWNvub5X6qVwk8VBqKyvurHGskLGMIJPc');
        this.handleChooseFile = this.handleChooseFile.bind(this);
        this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
        this.convertFile = this.convertFile.bind(this);
    }
    translate(Object) {
        console.log("OBJECT",Object)
        return new Promise(((resolve, reject) => {
            this.translator.translate(Object, this.state.targetLanguage, (err, result) => {
                if (err) reject(err);
                resolve(result);
                this.downloadFile(result);
            });
        }));
    }
    handleChooseFile(event){
        console.log("Running handle choose file...")
        let files = event.target.files;
        this.setState({
           fileChosen: files[0],
        });
    }
    convertFile(){
        console.log("Running convert file ...")
        let fileReader = new FileReader();
        fileReader.onload = function (e) {
            this.setState({fileContent:fileReader.result});
            let map = this.changeToMap(fileReader.result);
            this.translate(Array.from(map));
        }.bind(this)
        fileReader.readAsText(this.state.fileChosen);
    }
    handleChangeLanguage(language){
        console.log("Language was select: ", language.value)
        this.setState({
            targetLanguage: language.value,
        });

    }
    changeToMap(text){
        let lines = text.split("\n");
        let map = new Map();
        let key = [];
        lines.forEach((element)=>{
            let coupleVal = element.split(" = ");
            map.set(coupleVal[0],coupleVal[1]);
            key.push(coupleVal[0])
            this.setState({
                key : key
            })
        })
        return map.values();
    }
    downloadFile(values){
        {
            console.log("VALUE", values)
            let listString = "";
            for(let i = 0;i<this.state.key.length;i++){
                listString = listString + this.state.key[i] + " = " + values[i].translatedText+"\r\n"
            }
            let element = document.createElement("a");
            let file = new Blob([listString], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = "myFile.txt";
            element.click();
        }
    }
    componentDidMount(){
        this.translator.getSupportedLanguages('en',function(err, languageCodes) {
            console.log("LANGUAGE", languageCodes)
            let componentList = [];
            languageCodes.map((component) => {
                componentList.push({ value : component.language, label : component.name})
            });
            this.setState({
                listLanguage: componentList,
            })
        }.bind(this));
    }
  render() {
    return (
      <Fragment>
        <AppBar
          title="PFS Translator"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <div>
          <header className="App-header">
            <h1 className="App-title">Welcome</h1>
          </header>
          <FormGroup row>
            <Label>File Selector</Label>
            <Input type="file" onChange={this.handleChooseFile} />
            <Input type="text" onChange={this.handleChooseFile} />
            <label>Language: {this.state.language}</label>
              <Select options = {this.state.listLanguage} onChange = {this.handleChangeLanguage}/>
            <Button>Choose Language</Button>
          </FormGroup>
          <FormGroup>
            <Label>File Destination</Label>
            <Input type="file"/>
            <Input type="text" onChange={this.handleChooseFile} />
          </FormGroup>
          <FormGroup>
              <label>{this.state.exportFileName}</label>
            <Button onClick={this.convertFile}>Export</Button>
          </FormGroup>
        </div>

      </Fragment>
    );
  }
}

export default App;
