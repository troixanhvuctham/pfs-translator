import React, {PureComponent, Fragment} from 'react';
//import './App.css';
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
class App extends PureComponent {

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
        this.translator = GoogleTranslate('AIzaSyAqWP3koT5HtAoO8mfdllPkkPO099bdWoM');
    }

    translate = (obj) => {
        return new Promise(((resolve, reject) => {
            this.translator.translate(obj, this.state.targetLanguage, (err, result) => {
                if (err) reject(err);
                resolve(result);
                this.downloadFile(result);
            });
        }));
    };

    handleChooseFile = (event) => {
        let file = event.target.files[0];
        if (file) {
            this.fileChosen = file;
            this.setState({
                desFile: file.name.split(".").join("_" + this.state.targetLanguage + "."),
            })
        }
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
        if (this.fileChosen) {
            let list = this.fileChosen.name.split(".");
            desFile = `${list[0]}_${language.value}.${list[1]}`;
        }
        this.setState({
            targetLanguage: language.value,
            desFile,
        });
    };

    handleChangeDestination = (event) => {
        this.setState({
            desFile: event.target.value,
        })
    };
    getValues = (text) => {
        let values = [];
        this.key = [];
        const regex = /(.*) = (.*)$/gmu;
        let line;

        while ((line = regex.exec(text)) !== null) {
            this.key.push(line[1]);
            values.push(line[2]);
        }

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
            languageCodes.map((languageCode) => {
                componentList.push({value: languageCode.language, label: languageCode.name})
            });
            this.setState({
                listLanguage: componentList,
            })
        });
    };

    render() {
        return (
            <Fragment>
                <header className="text-lg-center App-header">
                    <span className="align-content-center">File Translator Web App</span>
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
                                <Select options={this.state.listLanguage} onChange={this.handleChangeLanguage}
                                        simpleValue
                                        multi/>
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Col xs="12" md="2">
                                <Label>Destination File:</Label>
                            </Col>
                            <Col xs="12" md="3">
                                <Input onChange={this.handleChangeDestination} value={this.state.desFile}/>
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
            </Fragment>
        );
    }
}
export default App;
