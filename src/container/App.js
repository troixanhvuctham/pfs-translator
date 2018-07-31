import React, {Component, Fragment} from 'react';
import './App.css';
import {
    Label, Button, Input, FormGroup, Col, Card, CardHeader, CardBody
} from 'reactstrap';
import GoogleTranslate from 'google-translate';
import Select from 'react-select';
import * as tf from '@tensorflow/tfjs';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exportFileName: "", listLanguage: [], targetLanguage: "zh", desFile: ""
        };

        this.key = [];
        this.fileChosen = null;
        this.translator = GoogleTranslate('AIzaSyDWNvub5X6qVwk8VBqKyvurHGskLGMIJPc');
        this.num = new Float32Array([21]);
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
            targetLanguage: language.value, desFile,
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
                return componentList.push({value: languageCode.language, label: languageCode.name})
            });
            this.setState({
                listLanguage: componentList,
            })
        });

        // Define a model for linear regression.
        const model = tf.sequential();
        model.add(tf.layers.dense({units: 1, batchInputShape: [null, 1]}));
        //model.add(tf.layers.dense({units: 2}));
        model.add(tf.layers.dense({units: 1}));

        // Prepare the model for training: Specify the loss and the optimizer.
        model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

        // Generate some synthetic data for training.
        const xs = tf.tensor2d([1, 2, 3, 4, 5], [5, 1]);
        const ys = tf.tensor2d([1, 4, 9, 16,25], [5, 1]);

        // Train the model using the data.
        let result;
        let num;
        model.fit(xs, ys, {epochs: 1000}).then(() => {
            // Use the model to do inference on a data point the model hasn't seen before:
            result = model.predict(tf.tensor2d([5], [1, 1]));
            model.predict(tf.tensor2d([1], [1, 1])).print();
            model.predict(tf.tensor2d([2], [1, 1])).print();
            model.predict(tf.tensor2d([3], [1, 1])).print();
            model.predict(tf.tensor2d([4], [1, 1])).print();
            let r = model.getWeights();
            console.log("#################")
            console.log(r.toString());
            num = result.dataSync()
            //console.log(num)
            this.num = num;
        });
    };

    render() {
        return (<Fragment>
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
                          <Col xs="12" md="2">
                              <Label>Result:</Label>
                          </Col>
                          <Col xs="12" md="3">
                              <Input onChange={this.handleChangeDestination} value={this.num}/>
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
          </Fragment>);
    }
}

export default App;
