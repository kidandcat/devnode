newVariable = function(name, value) {
    try {
        nodes.add({
            id: name,
            label: name + ': ' + value,
            value: value,
            color: '#ff3399'
        });
    } catch (e) {
        nodes.update({
            id: name,
            label: name + ': ' + value,
            value: value,
            color: '#ff3399'
        });
    }
}
