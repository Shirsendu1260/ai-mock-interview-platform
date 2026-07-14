import { Range } from "react-range";
import type { RangeSliderProps } from "../../types/types";

const RangeSlider = ({ min, max, values, onChange }: RangeSliderProps) => {
    return (
        <div className="w-full">
            <div className="mb-3 flex items-center justify-between text-sm font-medium text-muted">
                <span>{values[0]}</span>
                <span>{values[1]}</span>
            </div>

            <Range
                step={1}
                min={min}
                max={max}
                values={values}
                onChange={onChange}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        className="relative h-2 w-full rounded-full bg-border"
                        style={{ ...props.style }}
                    >
                        <div
                            className="absolute h-2 rounded-full bg-primary-light"
                            style={{
                                left: `${((values[0] - min) / (max - min)) * 100}%`,
                                width: `${((values[1] - values[0]) / (max - min)) * 100}%`
                            }}
                        />

                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div
                        {...props}
                        key={props.key}
                        className="
                            h-5 w-5 rounded-full cursor-pointer border-2 border-primary-light bg-white shadow-md transition-transform
                            hover:scale-106 active:scale-106 focus:outline-none focus:ring-2 focus:ring-primary-light/30
                        "
                    />
                )}
            />
        </div>
    );
};

export default RangeSlider;
