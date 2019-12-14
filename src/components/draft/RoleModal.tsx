import * as React from "react";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import Player from "../../constants/Player";

interface IProps extends WithTranslation {
    visible: boolean;
    setRoleCallback: (role: Player) => void;
}

class RoleModal extends React.Component<IProps, object> {

    public render() {
        if (this.props.visible) {
            return (
                <div id="overlay" className="text-primary">
                    <div id="get-role-message">
                        <h2><Trans>rolemodal.header</Trans></h2>
                        <p><Trans>rolemodal.callToAction</Trans></p>
                        <p>
                            <button onClick={() => {
                                this.props.setRoleCallback(Player.NONE)
                            }}>Spectate
                            </button>
                            <button onClick={() => {
                                this.props.setRoleCallback(Player.HOST)
                            }}>Host
                            </button>
                            <button onClick={() => {
                                this.props.setRoleCallback(Player.GUEST)
                            }}>Guest
                            </button>
                        </p>
                    </div>
                </div>
            );
        } else {
            return (<div/>);
        }
    }
}

export default withTranslation()(RoleModal);