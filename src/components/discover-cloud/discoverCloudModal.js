import React from "react"
import {
  Flex,
  Button,
  Box,
  Text,
  H3,
  H4,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Icon,
} from "@netdata/netdata-ui"

import GoToCloud from "components/auth/signIn"

export const TITLE = "Discover the free benefits of Netdata Cloud"

const DiscoverCloudModal = ({ closeModal, text, header, handleGoToCloud, image, video }) => {
  return (
    <Modal borderShadow backdrop={false}>
      <ModalContent background="modalBackground">
        <ModalHeader>
          <Flex gap={2}>
            <Icon color="white" name="netdata" />
            <H3 margin={[0]}>{TITLE}:</H3>
          </Flex>

          <ModalCloseButton onClose={closeModal} />
        </ModalHeader>
        <ModalBody>
          <Flex column width={189} height={130}>
            <Flex padding={[0, 0, 4, 0]} column gap={4}>
              <Flex alignItems="center">
                <H4 margin={[0]}>{header}</H4>
                <Box
                  sx={{ marginLeft: "auto" }}
                  data-testid="go-to-cloud-cta"
                  margin={[0, 2, 0, 0]}
                  width={{ min: 40 }}
                >
                  <GoToCloud utmParameters={{ campaign: "discover_cloud" }}>
                    {({ link }) => (
                      <Box
                        label={
                          <Text textTransform="none" strong color="panel">
                            Sign in to Netdata Cloud!
                          </Text>
                        }
                        width="100%"
                        onClick={() => handleGoToCloud({ link })}
                        as={Button}
                        small
                        data-ga={"go-to-cloud-button"}
                        data-testid="cta1-button"
                      />
                    )}
                  </GoToCloud>
                </Box>
              </Flex>
              {text()}
            </Flex>
            {image && (
              <Flex height="auto" width="100%" overflow="hidden">
                <Box
                  sx={{
                    width: "100%",
                    height: "auto",
                  }}
                  as="img"
                  src={image}
                ></Box>
              </Flex>
            )}
            {video && (
              <Flex height="100%" width="100%">
                <Box sx={{ width: "100%", height: "100%" }}>
                  <iframe
                    title={`discover-cloud-iframe}`}
                    width="100%"
                    height="100%"
                    src={video}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              </Flex>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DiscoverCloudModal
