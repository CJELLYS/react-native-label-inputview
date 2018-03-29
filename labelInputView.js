import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';

const initTextInput = ' ';//默认有一个空格,预留删除时使用
const ifSubmit = false;//是否点击键盘提交
export default class LabelInputView extends Component {
    constructor(props) {
        super(props);
        this.labelAryCopy = JSON.parse(JSON.stringify(this.props.labelAry));
        this.state = {
            lableTextInput: initTextInput,//默认有一个空格,预留删除时使用
            labelAry: JSON.parse(JSON.stringify(this.props.labelAry)),
            ifDone: ifSubmit,
            textInputStyle: styles.textInputStyle,//初始样式
        }
    }

    componentWillReceiveProps(nextProps) {
        this.labelAryCopy = JSON.parse(JSON.stringify(nextProps.labelAry));
        this.setState({
            labelAry: JSON.parse(JSON.stringify(nextProps.labelAry))
        })
    }

    //输入文字
    onChangeText(lableTextInput) {
        if (lableTextInput.length == 0 && this.labelAryCopy.length != 0) {
            let str = this.labelAryCopy.pop();//获取最后一个并删除掉
            this.setState({
                lableTextInput: initTextInput + str,
                labelAry: JSON.parse(JSON.stringify(this.labelAryCopy))
            })
            this.props.addLabelAction(this.labelAryCopy);
        } else {
            if (this.state.ifDone) {
                this.setState({
                    lableTextInput: initTextInput,
                    ifDone: ifSubmit,
                })
            } else {
                this.setState({
                    lableTextInput: lableTextInput,
                })
            }
        }
    }

    //提交输入内容
    onSubmitEditing() {
        let tag = this.state.lableTextInput.replace(' ', '');//过滤首字母空格
        this.setState({
            ifDone: !ifSubmit,
        })
        //限制最大条数
        if (this.props.labelMaxLimitNum && this.props.labelMaxLimitNum === this.state.labelAry.length) {
            return;
        }
        if (tag.length > 0) {
            this.labelAryCopy.push(tag);
            this.setState({
                labelAry: JSON.parse(JSON.stringify(this.labelAryCopy))
            })

            this.props.addLabelAction(this.labelAryCopy);
        } else {
            this.props.popupWindowAction()
        }
    }

    textInputLayout(event) {
        this.setState({
            inputLayoutX: event.nativeEvent.layout.x
        })
    }

    labelViews() {
        let views = [];
        let index = 1;
        for (const item of this.state.labelAry) {
            index++;
            views.push(
            <View key={index} style={[styles.labelStyle,this.props.labelStyle]}>
                <Text style={this.props.labelTextStyle}>{item}</Text>
            </View>)
        }

        let inputStyle = {};
        if (this.state.inputLayoutX > px(300)) {
            inputStyle = styles.textMinInputStyle;
        } else {
            if (this.state.inputLayoutX < px(20)) {
                inputStyle = styles.textWidthInputStyle;
            } else {
                inputStyle = styles.textInputStyle;
            }
        }

        views.push(
        <TextInput key={0} style={[inputStyle]}
            onLayout={(event) => this.textInputLayout(event)}
            multiline={true}
            autoFocus={true}
            selectionColor={'#FF4604'}
            onChangeText={(lableTextInput) => this.onChangeText(lableTextInput)}
            value={this.state.lableTextInput}
            onSubmitEditing={() => this.onSubmitEditing()}
            underlineColorAndroid="transparent"
            returnKeyType='done'
        />);
        return views;
    }

    render() {
        return (
        <View style={[this.props.labelWrapStyle, styles.labelWrapStyle]}>
            {this.labelViews()}
        </View>
        );
    }
}

LabelInputView.defaultProps = {
    labelAry: [],
    labelMaxLimitNum: 6,//限制最多有多少个标签
    popupWindowAction: f => f,//弹窗提示
    addLabelAction: f => f,// 添加标签到ary中.外界可以获取到
    labelWrapStyle: {},//label View style
    labelStyle:{},//label style
    labelTextStyle:{},//label title style
    autoFocus: true,// textInput autoFocus
    multiline: true,//textInput multiline
    selectionColor: '#FF4604',//textInput ios
    
}

const styles = StyleSheet.create({
    labelWrapStyle: {
        flexDirection: 'row',
        marginHorizontal: px(20),
        paddingBottom: px(12),
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        borderBottomColor: RCC.Style.GYLL,
        borderBottomWidth: 1,
    },

    labelStyle: {
        paddingHorizontal: px(8),
        marginTop: px(10),
        height: px(26),
        marginRight: px(10),
        justifyContent: 'center',
        backgroundColor: RCC.Style.GYLL,
        borderRadius: px(13)
    },
    textInputStyle: {
        flex: 1,
        fontSize: px(12),
        padding: 0,
        marginTop: px(10),
        color: '#333333',
        height: px(26),
    },
    textMinInputStyle: {
        width: px(75),
        height: px(26),
        fontSize: px(12),
        padding: 0,
        marginTop: px(10),
        color: '#333333',
    },
    textWidthInputStyle: {
        width: px(200),
        fontSize: px(12),
        padding: 0,
        marginTop: px(10),
        color: '#333333',
        height: px(26),
    },
})