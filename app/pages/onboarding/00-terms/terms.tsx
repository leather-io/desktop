import React from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Box } from '@blockstack/ui';

import routes from '@constants/routes.json';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
} from '@components/onboarding';
import { useBackButton } from '@hooks/use-back-url';
import { ENTITY_NAME, FULL_ENTITY_NAME } from '@constants/index';

export const Terms: React.FC = () => {
  const history = useHistory();
  useBackButton(null);
  return (
    <Onboarding maxWidth="800px">
      <OnboardingTitle mb="base" mt="extra-loose">
        Terms of Service
      </OnboardingTitle>
      <OnboardingText mb="extra-loose">
        You must first accept the terms of service before using the Stacks Wallet
      </OnboardingText>
      <Box textStyle="body.small" mx="base">
        These terms of use (“<strong>Terms</strong>”) govern your use of the Stacks Wallet software
        (the “<strong>Software</strong>”) made available to you by {FULL_ENTITY_NAME} (“
        <strong>{ENTITY_NAME}</strong>”). By clicking “I Accept,” downloading, installing,
        accessing, or using the Software, you agree to be bound by the following terms and
        conditions.
        <Box as="ol">
          <Box as="li" mt="base">
            <strong>Address Generation</strong>. The Software allows you to generate a
            private-public key pair (your “<strong>Keys</strong>”) for receiving Stacks
            cryptocurrency (<strong>“Stacks”</strong>) and also enables the optional use of a
            hardware wallet for storing your Keys. Use of a hardware wallet is always recommended
            for enhanced security. {ENTITY_NAME.toUpperCase()} DOES NOT HOLD YOUR KEYS FOR YOU. WE
            CANNOT ACCESS YOUR ACCOUNT OR RECOVER YOUR KEYS. IF YOU NEED TO RESTORE YOUR WALLET, YOU
            MUST ENTER THE SEED PHRASE PROVIDED WHEN YOU FIRST CREATE A NEW WALLET. YOU ARE SOLELY
            RESPONSIBLE FOR SAFEGUARDING YOUR KEYS AND THE SEED PHRASE. The Software does not
            support all hardware wallets, which are made by third parties, and {ENTITY_NAME} has no
            control, responsibility, or liability with respect to such third-party hardware wallets.
          </Box>
          <Box as="li" mt="base">
            <strong>Transactions</strong>. The Software allows you to initiate transactions for
            sending Stacks. You acknowledge and agree that sending Stacks requires nonrefundable
            transaction fees that you must pay in Stacks. Transaction fees are awarded automatically
            to independent third-party miners by the network protocol. {ENTITY_NAME} has no
            responsibility, control, or influence over transactions and transaction fees. Once a
            transaction is initiated, it cannot be revoked or cancelled, and no return or refund of
            funds or transaction fees is possible. You understand and agree that you are solely
            responsible for compliance with all applicable laws when transacting Stacks, including
            but not limited to securities laws, money transmitter laws, BitLicense regulations, and
            sanctions and anti-money laundering laws
          </Box>
          <Box as="li" mt="base">
            <strong>Stacking</strong>. The Software allows you to participate in Stacking, which is
            a feature of the Stacks 2.0 blockchain in which you may earn Bitcoin rewards by locking
            a dynamic minimum amount of Stacks and publishing useful information on the network. The
            dynamic minimum amount of Stacks you must lock to participate fluctuates based on
            overall participation in Stacking. This threshold is 0.025% of the participating amount
            of Stacks when participation is between 25% and 100%, and when participation is below
            25%, the threshold level is 0.00625% of the liquid supply of Stacks. You must also
            submit a valid Bitcoin address for receiving Bitcoin rewards. Once submitted, you cannot
            change the Bitcoin address for the number of cycles you have chosen to lock your Stacks,
            and you understand and agree that any rewards sent to the submitted Bitcoin address will
            be controlled by the owner of the Bitcoin address. The amount of Bitcoin you might
            receive depends on a large number of unpredictable factors, including the price of
            Stacks, the price of Bitcoin, Bitcoin transaction fees, Stacks transaction fees, the
            number of miners, the number of Stacking participants, and many other factors.
            {ENTITY_NAME} makes no representations or guarantees as to how much Bitcoin you may earn
            from Stacking. You acknowledge and agree that participation in Stacking is entirely
            optional and done at your own risk. {ENTITY_NAME} has no responsibility, control, or
            influence over Stacking, which occurs through network protocols and not via the
            Software, which operates as only one possible way to access Stacking. You further
            understand and agree that you are solely responsible for compliance with all applicable
            laws when participating in Stacking, including but not limited to securities laws, money
            transmitter laws, BitLicense regulations, and sanctions and anti-money laundering laws.
            You further understand and agree that receipt of Bitcoin rewards may be considered
            taxable income in your jurisdiction, and you are solely and fully responsible for any
            and all applicable taxes.
          </Box>
          <Box as="li" mt="base">
            <strong>GPLv3</strong>. The Software is provided under the GNU General Public License
            version 3.0 (“GPLv3”), a copy of which is available at
            https://opensource.org/licenses/GPL-3.0, as supplemented by Sections 5 and 9-11 of the
            Terms.
          </Box>
          <Box as="li" mt="base">
            <strong>No Trademark License</strong>. You acknowledge and agree that, notwithstanding
            the terms of GPLv3, neither these Terms nor the terms of GPLv3 provide you with any
            right or license to use any trade name, trademark, service mark or other indicator of
            {ENTITY_NAME} or any of its affiliates, and you agree not to use any {ENTITY_NAME} trade
            name, trademark or service mark without {ENTITY_NAME}’s express written consent.{' '}
          </Box>
          <Box as="li" mt="base">
            <strong>Term; Termination.</strong> These Terms are effective beginning when you accept
            the Terms or first download, install, access, or use the Software, and ending when you
            cease all use of the Software. Sections 9, 10, 11, and 13 will survive termination.
          </Box>
          <Box as="li" mt="base">
            <strong>Third Party Linked Websites.</strong> {ENTITY_NAME} may provide tools through
            the Software that enable you to export information to third party services. By using one
            of these tools, you agree that {ENTITY_NAME} may transfer that information to the
            applicable third party service. Third party services are not under {ENTITY_NAME}’s
            control, and, to the fullest extent permitted by law, {ENTITY_NAME} is not responsible
            for any third party service’s use of your exported information. The Software may also
            contain links to third party websites. Linked websites are not under {ENTITY_NAME}’s
            control, and {ENTITY_NAME} is not responsible for their content.
          </Box>
          <Box as="li" mt="base">
            <strong>Modification of the Software.</strong> {ENTITY_NAME} reserves the right to
            modify or discontinue the Software at any time (including by limiting or discontinuing
            certain features of the Software), temporarily or permanently, without notice to you.{' '}
            {ENTITY_NAME}
            will have no liability for any change to the Software.
          </Box>
          <Box as="li" mt="base">
            <strong>Indemnity.</strong> To the fullest extent permitted by law, you are responsible
            for your use of the Software, and you will defend and indemnify {ENTITY_NAME} and its
            officers, directors, employees, consultants, affiliates, subsidiaries and agents
            (together, the “{ENTITY_NAME} Entities”) from and against every claim brought by a third
            party, and any related liability, damage, loss, and expense, including reasonable
            attorneys’ fees and costs, arising out of or connected with: (a) your unauthorized use
            of, or misuse of, the Software; (b) your violation of any portion of these Terms, any
            representation, warranty, or any applicable law or regulation; (c) your violation of any
            third party right, including any intellectual property right or publicity,
            confidentiality, other property, or privacy right; or (d) any dispute or issue between
            you and any third party, including without limitation for any liability arising from
            contractual assumptions of liability made by you to a third-party in connection with a
            conveyance of the Software or a modified version of the Software to such third-party. We
            reserve the right, at our own expense, to assume the exclusive defense and control of
            any matter otherwise subject to indemnification by you (without limiting your
            indemnification obligations with respect to that matter), and in that case, you agree to
            cooperate with our defense of those claims.
          </Box>
          <Box as="li" mt="base">
            <strong>Disclaimers; No Warranties</strong>
            <br />
            <br />
            THE SOFTWARE AND ALL MATERIALS AND CONTENT AVAILABLE THROUGH THE SOFTWARE ARE PROVIDED
            “AS IS” AND ON AN “AS AVAILABLE” BASIS. {ENTITY_NAME.toUpperCase()} DISCLAIMS ALL
            WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, RELATING TO THE SOFTWARE AND ALL
            MATERIALS AND CONTENT AVAILABLE THROUGH THE SOFTWARE, INCLUDING: (A) ANY IMPLIED
            WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT,
            OR NON-INFRINGEMENT; AND (B) ANY WARRANTY ARISING OUT OF COURSE OF DEALING, USAGE, OR
            TRADE. {ENTITY_NAME.toUpperCase()} DOES NOT WARRANT THAT THE SOFTWARE OR ANY PORTION OF
            THE SOFTWARE, OR ANY MATERIALS OR CONTENT OFFERED THROUGH THE SOFTWARE, WILL BE
            UNINTERRUPTED, SECURE, OR FREE OF ERRORS, VIRUSES, OR OTHER HARMFUL COMPONENTS, AND{' '}
            {ENTITY_NAME.toUpperCase()} DOES NOT WARRANT THAT ANY OF THOSE ISSUES WILL BE CORRECTED.
            NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM THE SOFTWARE OR{' '}
            {ENTITY_NAME.toUpperCase()} ENTITIES OR ANY MATERIALS OR CONTENT AVAILABLE THROUGH THE
            SOFTWARE WILL CREATE ANY WARRANTY REGARDING ANY OF THE {ENTITY_NAME.toUpperCase()}{' '}
            ENTITIES OR THE SOFTWARE THAT IS NOT EXPRESSLY STATED IN THESE TERMS. WE ARE NOT
            RESPONSIBLE FOR ANY DAMAGE THAT MAY RESULT FROM THE SOFTWARE. YOU ARE SOLELY RESPONSIBLE
            FOR RECORDING AND SAFEGUARDING YOUR KEYS AND SEED PHRASE. YOU UNDERSTAND AND AGREE THAT
            YOU USE ANY PORTION OF THE SOFTWARE AT YOUR OWN DISCRETION AND RISK, AND THAT WE ARE NOT
            RESPONSIBLE FOR ANY DAMAGE TO YOUR PROPERTY (INCLUDING YOUR COMPUTER SYSTEM OR MOBILE
            DEVICE USED IN CONNECTION WITH THE SOFTWARE) OR ANY LOSS OF DATA, INCLUDING STACKS. THE
            LIMITATIONS, EXCLUSIONS AND DISCLAIMERS IN THIS SECTION APPLY TO THE FULLEST EXTENT
            PERMITTED BY LAW. {ENTITY_NAME} does not disclaim any warranty or other right that
            {ENTITY_NAME} is prohibited from disclaiming under applicable law.
          </Box>
          <Box as="li" mt="base">
            <strong>Limitation of Liability</strong>
            <br />
            <br />
            TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL THE {ENTITY_NAME.toUpperCase()}{' '}
            ENTITIES BE LIABLE TO YOU FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR
            PUNITIVE DAMAGES (INCLUDING DAMAGES FOR LOSS OF PROFITS, GOODWILL, OR ANY OTHER
            INTANGIBLE LOSS) ARISING OUT OF OR RELATING TO YOUR ACCESS TO OR USE OF, OR YOUR
            INABILITY TO ACCESS OR USE, THE SOFTWARE, YOUR KEYS, STACKS, OR ANY MATERIALS OR CONTENT
            ON THE SOFTWARE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE),
            STATUTE, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT ANY {ENTITY_NAME.toUpperCase()}{' '}
            ENTITY HAS BEEN INFORMED OF THE POSSIBILITY OF DAMAGE. TO THE FULLEST EXTENT PERMITTED
            BY LAW, THE AGGREGATE LIABILITY OF THE {ENTITY_NAME.toUpperCase()}
            ENTITIES TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE USE OF OR ANY INABILITY
            TO USE ANY PORTION OF THE SOFTWARE OR OTHERWISE UNDER THESE TERMS, WHETHER IN CONTRACT,
            TORT, OR OTHERWISE, IS LIMITED TO $100. EACH PROVISION OF THESE TERMS THAT PROVIDES FOR
            A LIMITATION OF LIABILITY, DISCLAIMER OF WARRANTIES, OR EXCLUSION OF DAMAGES IS INTENDED
            TO AND DOES ALLOCATE THE RISKS BETWEEN THE PARTIES UNDER THESE TERMS. THIS ALLOCATION IS
            AN ESSENTIAL ELEMENT OF THE BASIS OF THE BARGAIN BETWEEN THE PARTIES. EACH OF THESE
            PROVISIONS IS SEVERABLE AND INDEPENDENT OF ALL OTHER PROVISIONS OF THESE TERMS. THE
            LIMITATIONS IN THIS SECTION 11 WILL APPLY EVEN IF ANY LIMITED REMEDY FAILS OF ITS
            ESSENTIAL PURPOSE.
          </Box>
          <Box as="li" mt="base">
            <strong>Privacy Policy.</strong> Please read the {ENTITY_NAME} Privacy Policy, a copy of
            which is available at https://www.blockstack.org/p/terms-privacy, carefully for
            information relating to our collection, use, storage, disclosure of your personal
            information. The {ENTITY_NAME} Privacy Policy is incorporated by this reference into,
            and made a part of, these Terms.
          </Box>
          <Box as="li" mt="base">
            <strong>Miscellaneous.</strong> You may not assign or transfer these Terms or your
            rights under these Terms, in whole or in part, by operation of law or otherwise, without
            our prior written consent. We may assign these Terms at any time without notice or
            consent. The failure to require performance of any provision will not affect our right
            to require performance at any other time after that, nor will a waiver by us of any
            breach or default of these Terms, or any provision of these Terms, be a waiver of any
            subsequent breach or default or a waiver of the provision itself. If any part of these
            Terms is held to be invalid or unenforceable, the unenforceable part will be given
            effect to the greatest extent possible, and the remaining parts will remain in full
            force and effect. These Terms are governed by the laws of the State of New York without
            regard to conflict of law principles. You and {ENTITY_NAME} submit to the personal and
            exclusive jurisdiction of the state courts and federal courts located within New York
            County, New York for resolution of any lawsuit or court proceeding permitted under these
            Terms. We are under no obligation to provide support for the Software. In instances
            where we may offer support, the support will be subject to published policies.
          </Box>
        </Box>
      </Box>
      <Flex justifyContent="center" alignItems="center" mt="extra-loose" mb="120px">
        <Flex>
          <OnboardingButton onClick={() => console.log('Close wallet')} mode="secondary">
            Close
          </OnboardingButton>
          <OnboardingButton onClick={() => history.push(routes.WELCOME)} ml="base">
            I accept
          </OnboardingButton>
        </Flex>
      </Flex>
    </Onboarding>
  );
};
