
const React = require('react-native');
const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const standardFontSize = Math.round(((deviceHeight / 480) - 1) * (28 - 16) + 16)

export default {
	content: {
		marginTop: 10,
	},
	studentsListContainer: {
		paddingRight: 20
	},
	schoolNameText: {
		fontWeight: 'bold',
		fontSize: standardFontSize + 2,
	},
	studentNameText: {
		fontSize: standardFontSize,
		color: "#fff",
		fontWeight: 'bold',
	},
	studentNameRow: {
		backgroundColor: "rgba(82,121,146, 0.8)",
		borderRadius: 15,
		alignItems: 'center',
    	justifyContent: 'center',
    	height: 100,
    	marginBottom: 10
	}
};
