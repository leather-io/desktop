import React from "react";
import { Block, Backdrop, Overlay } from "reakit";
import { Flex, Box, Card, Type } from "blockstack-ui/dist";
import { CloseIcon } from "mdi-react";

const ModalContext = React.createContext();

const Component = ({ children, ...rest }) => children({ ...rest });

export const Modal = ({ title, children, hide, visible, p = 4, ...rest }) => (
  <Card
    p={0}
    flexGrow={1}
    width={["90vw", "70vw"]}
    maxHeight={"90vh"}
    {...rest}
  >
    <Flex
      justifyContent={"space-between"}
      borderBottom="1px solid"
      borderColor={"blue.mid"}
      px={4}
      py={3}
      flexShrink={0}
    >
      <Type fontWeight={500}>{title}</Type>
      <Flex onClick={hide}>
        <CloseIcon />
      </Flex>
    </Flex>
    <Flex p={p} flexDirection="column" overflow="auto" flexGrow={1}>
      {children}
    </Flex>
  </Card>
);

class ModalRoot extends React.Component {
  state = {
    comp: null,
    visible: false
  };

  componentWillUnmount() {
    this.setState({
      comp: null
    });
  }

  timeout = null;

  handleShow = (show, comp) => {
    this.setState({ comp, visible: true });
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    show();
  };

  handleHide = hide => {
    this.timeout = setTimeout(() => this.setState({ visible: false }), 200);
    hide();
  };

  render() {
    const { children } = this.props;

    return (
      <Overlay.Container>
        {overlay => {
          const props = {
            ...overlay,
            show: comp => this.handleShow(overlay.show, comp),
            hide: () => this.handleHide(overlay.hide)
          };
          return (
            <ModalContext.Provider value={props}>
              <>
                {children}
                <Overlay
                  style={{
                    transform: "none",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  fade
                  {...overlay}
                >
                  <Flex
                    justifyContent="center"
                    width={[1, 1, "auto"]}
                    position="relative"
                    zIndex={999}
                  >
                    {this.state.visible &&
                      this.state.comp({
                        hide: () => this.handleHide(overlay.hide),
                        visible: overlay.visible
                      })}
                  </Flex>
                  <Box color="hsla(225,50%,7%,0.75)">
                    <Backdrop
                      style={{ background: "currentColor" }}
                      as={Overlay.Hide}
                      fade
                      {...overlay}
                      hide={() => this.handleHide(overlay.hide)}
                    />
                  </Box>
                </Overlay>
              </>
            </ModalContext.Provider>
          );
        }}
      </Overlay.Container>
    );
  }
}

export const ModalConsumer = ModalContext.Consumer;

export const OpenModal = ({ component, children, title, content, ...rest }) => (
  <ModalConsumer>
    {({ visible, show, hide }) =>
      children({
        bind: {
          onClick: () => show(component)
        }
      })
    }
  </ModalConsumer>
);

export default ModalRoot;
