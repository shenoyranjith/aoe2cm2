import * as React from "react";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import {Redirect} from "react-router";
import Preset from "../models/Preset";
import PresetListElement from "./PresetListElement";
import CustomiseButton from "./CustomiseButton";

interface IState {
    draftId: string | null;
}

class Presets extends React.Component<WithTranslation, IState> {

    constructor(props: WithTranslation) {
        super(props);
        this.state = {draftId: null};
    }

    public render() {
        if (this.state.draftId !== null) {
            const target = '/draft/' + this.state.draftId;
            return (<Redirect to={target}/>);
        }

        return (
            <div>
                <div id="join_game" className="home_card box">
                    <h2><Trans i18nKey='presets.joinTitle'>Join existing draft</Trans></h2>
                    <div>
                        <div className="centered text-primary info-card">
                            <Trans i18nKey='presets.code'>code:</Trans>
                        </div>
                        <div className="code">
                            <input id="input-code" type="text" name="code" className="inset-input"/>
                        </div>
                        <div className="pure-g join-actions text-primary">
                            <div className="pure-u-1-1">
                                <div className="join-action">
                                    <button className="shadowbutton text-primary" id="join-game-button"
                                            onClick={this.joinDraft}>
                                        <Trans i18nKey='presets.join'>Join</Trans>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <div className="card home_card">
                            <h2><Trans i18nKey='presets.useTitle'>Use preset</Trans></h2>
                            <ul>
                                <PresetListElement preset={Preset.NAC3_QUALIFICATION_BO7}/>
                                <PresetListElement preset={Preset.NAC3_QUALIFICATION_BO9}/>
                            </ul>

                            <div className="pure-g join-actions text-primary">
                                <div className="pure-u-1-1">
                                    <CustomiseButton preset={Preset.NEW} i18nKey='createPreset'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private joinDraft = () => {
        const draftIdInput = document.getElementById('input-code') as HTMLInputElement;
        const draftId: string | null = draftIdInput.value;
        this.setState({...this.state, draftId});
    };
}

export default withTranslation()(Presets);