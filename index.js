import * as React from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { TouchableRipple } from "react-native-paper";
import MaskedView from "@react-native-community/masked-view";

const ButtonToggleGroup = ({
	values,
	onSelect,
	style,
	highlightBackgroundColor,
	highlightTextColor,
	inactiveBackgroundColor,
	inactiveTextColor,
	textStyle = {},
}) => {
	const [prevSelectedIndex, setPrevSelectedIndex] = React.useState(0);
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const selectedPanelLeft = React.useRef(new Animated.Value(0));

	const widthSize = 100 / values.length;

	const interpolatedValuesInput = values.map((_, i) => {
		return widthSize * i;
	});

	const interpolatedValuesOutput = values.map((_, i) => {
		return `${widthSize * i}%`;
	});

	React.useEffect(() => {
		const left = widthSize * selectedIndex;

		Animated.timing(selectedPanelLeft.current, {
			toValue: left,
			duration: 300,
			useNativeDriver: false,
		}).start(() => {
			setPrevSelectedIndex(selectedIndex);
		});
	}, [widthSize, selectedPanelLeft, selectedIndex]);

	const maxIndex =
		selectedIndex > prevSelectedIndex ? selectedIndex : prevSelectedIndex;
	const minIndex =
		selectedIndex > prevSelectedIndex ? prevSelectedIndex : selectedIndex;

	const highlightMask = {
		backgroundColor: highlightBackgroundColor,
	};

	const highlightText = {
		color: highlightTextColor,
	};

	const inactiveText = {
		color: inactiveTextColor,
	};

	const inactiveBackground = {
		backgroundColor: inactiveBackgroundColor,
	};

	return (
		<View style={[styles.container, style]}>
			<MaskedView
				key={selectedIndex}
				style={styles.maskViewContainer}
				maskElement={
					<Animated.View
						style={[
							styles.blueMaskContainer,
							{
								width: `${widthSize}%`,
								left: selectedPanelLeft.current.interpolate({
									inputRange: interpolatedValuesInput,
									outputRange: interpolatedValuesOutput,
								}),
							},
						]}
					/>
				}
			>
				<View style={[styles.baseButtonContainer, highlightMask]}>
					{values.map((value, i) => (
						<TouchableRipple
							key={i}
							onPress={() => {
								setSelectedIndex(i);
								onSelect(values[i]);
							}}
							style={styles.baseTouchableRipple}
						>
							<Text
								style={[
									styles.baseButtonText,
									styles.highlightText,
									textStyle,
									highlightText,
								]}
								numberOfLines={1}
							>
								{value}
							</Text>
						</TouchableRipple>
					))}
				</View>
			</MaskedView>
			<View
				style={[styles.baseButtonContainer, styles.inactiveButtonContainer]}
			>
				{values.map((value, i) => (
					<TouchableRipple
						key={i}
						style={[
							styles.baseTouchableRipple,
							{
								zIndex: minIndex <= i && maxIndex >= i ? -1 : 0,
							},
							inactiveBackground,
						]}
						onPress={() => {
							setSelectedIndex(i);
							onSelect(values[i]);
						}}
					>
						<Text
							style={[styles.baseButtonText, textStyle, inactiveText]}
							numberOfLines={1}
						>
							{value}
						</Text>
					</TouchableRipple>
				))}
			</View>
		</View>
	);
};

export default ButtonToggleGroup;

const styles = StyleSheet.create({
	container: {
		height: 48,
		position: "relative",
	},
	maskViewContainer: {
		width: "100%",
		height: "100%",
		position: "relative",
	},
	blueMaskContainer: {
		position: "absolute",
		backgroundColor: "black",
		borderRadius: 4,
		height: "100%",
		left: 0,
		top: 0,
	},
	baseButtonContainer: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "nowrap",
		justifyContent: "space-around",
		alignItems: "center",
	},
	inactiveButtonContainer: {
		position: "absolute",
		top: 4,
		left: 4,
		width: "100%",
		height: "100%",
	},
	baseTouchableRipple: {
		height: "100%",
		flex: 1,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	baseButtonText: {
		paddingHorizontal: 16,
	},
	highlightText: {
		zIndex: 1,
	},
});
