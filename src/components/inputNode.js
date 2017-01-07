import React from 'react';
// import { Form, Input, Icon, Button } from 'antd';
var Form = require('antd/lib/form');
const FormItem = Form.Item;

class DynamicFieldSet extends React.Component {
    render() {
        return (
            <Form>
                <FormItem>123</FormItem>
            </Form>
        )
    }
}

export default DynamicFieldSet;