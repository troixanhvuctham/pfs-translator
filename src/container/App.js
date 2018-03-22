import React, {Component, Fragment} from 'react';
import './App.css';
import {
    Label,
    Button,
    Input,
    FormGroup,
    Col,
    Card,
    CardHeader,
    CardBody
} from 'reactstrap';
import GoogleTranslate from 'google-translate';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.css';
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exportFileName: "",
            listLanguage: [],
            targetLanguage: "zh",
            desFile: ""
        };

        this.key = [];
        this.fileChosen = null;
        this.translator = GoogleTranslate('AIzaSyDWNvub5X6qVwk8VBqKyvurHGskLGMIJPc');
    }

    translate = (Object) => {
        return new Promise(((resolve, reject) => {
            this.translator.translate(Object, this.state.targetLanguage, (err, result) => {
                if (err) reject(err);
                resolve(result);
                this.downloadFile(result);
            });
        }));
    };

    handleChooseFile = (event) => {
        let files = event.target.files;
        this.fileChosen = files[0];
        this.setState({
            desFile: files[0].name.split(".").join("_" + this.state.targetLanguage + "."),
        })
    };

    convertFile = () => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            let values = this.getValues(fileReader.result);
            this.translate(values);
        };
        fileReader.readAsText(this.fileChosen);
    };

    handleChangeLanguage = (language) => {
        let desFile = "";
        if(this.fileChosen){
            desFile = this.fileChosen.name.split(".").join("_" + language.value + ".");
        }
        this.setState({
            targetLanguage: language.value,
            desFile: desFile,
        });
    };

    handleChangeDestination = (event) => {
        this.setState({
            desFile: event.target.value,
        })
    };
    getValues = (text) => {
        let lines = text.split("\n");
        let values = [];
        let key = [];

        lines.forEach((element) => {
            if(element.trim()!==""){
                /(.*) = (.*)$/gmu.exec(element);
                key.push(RegExp.$1);
                values.push(RegExp.$2);
            };
        });
        this.key = key;
        return values;
    };

    downloadFile = (values) => {
        {
            let listString = [];

            for (let i = 0; i < this.key.length; i++) {
                listString.push(`${this.key[i]} = ${values[i].translatedText}`);
            }
            const text = listString.join("\n");

            let element = document.createElement("a");
            let file = new Blob([text], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);

            element.download = this.state.desFile;
            element.click();
        }
    };

    componentDidMount() {
        this.translator.getSupportedLanguages('en', (err, languageCodes) => {
            let componentList = [];
            languageCodes.map((component) => {
                componentList.push({value: component.language, label: component.name})
            });
            this.setState({
                listLanguage: componentList,
            })
        });
    };

    render() {
        return (
            <Fragment>
                <div>
                    <header className="App-header">
                        <h1 className="align-content-center">Welcome</h1>
                    </header>
                    <Card>
                        <CardHeader className="font-weight-bold">
                            File Translator
                        </CardHeader>
                        <CardBody>
                            <FormGroup row>
                                <Col xs="12" md="2">
                                    <Label>File Selector:</Label>
                                </Col>
                                <Col xs="12" md="3">
                                    <Input type="file" onChange={this.handleChooseFile}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col xs="12" md="2">
                                    <label>Language: {this.state.language}</label>
                                </Col>
                                <Col xs="12" md="3">
                                    <Select options={this.state.listLanguage} onChange={this.handleChangeLanguage} simpleValue
                                            multi/>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Col xs="12" md="2">
                                    <Label>Destination File:</Label>
                                </Col>
                                <Col xs="12" md="3">
                                    <Input onChange={this.handleChangeDestination} value={this.state.desFile} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col xs="12" md="5">
                                    <label>{this.state.exportFileName}</label>
                                    <Button className="float-right" color="success"
                                            onClick={this.convertFile}>Export</Button>
                                </Col>
                            </FormGroup>
                        </CardBody>
                    </Card>
                </div>
            </Fragment>
        );
    }
}
export default App;
