import React from 'react';
import { useHistory } from 'react-router-dom';

import routes from '@constants/routes.json';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
} from '@components/onboarding';
import { useBackButton } from '@hooks/use-back-url';
import { Flex, Box } from '@blockstack/ui';

export const Terms: React.FC = () => {
  const history = useHistory();
  useBackButton(null);
  return (
    <Onboarding maxWidth="800px">
      <OnboardingTitle mb="base" mt="extra-loose">
        Terms of Use
      </OnboardingTitle>
      <OnboardingText mb="extra-loose">
        You must first accept the terms of service before using the Stacks Wallet
      </OnboardingText>
      <Box textStyle="body.small" mx="base">
        This agreement (these “<strong>Terms</strong>”) governs the terms under which you may
        download the Stacks Wallet software (the “<strong>Software</strong>”) made available to you
        by Blockstack Public Benefit Corporation (“<strong>Blockstack</strong>”). By clicking “I
        Accept,” or by downloading, installing, or otherwise accessing or using the Software, you
        agree that you have read and understood, and, as a condition to your download of the
        Software, you agree to be bound by, the following terms and conditions.
        <br />
        <br />
        <strong>1. Overview.</strong> The Software is provided to you for the purpose of enabling
        your use of a hardware wallet, in order to receive Blockstack tokens (the “
        <strong>Stacks Tokens</strong>”). BLOCKSTACK DOES NOT HOLD YOUR SEED PHRASE FOR YOU. WE
        CANNOT ACCESS YOUR ACCOUNT OR RECOVER YOUR SEED PHRASE. IF YOU LOSE YOUR SEED PHRASE, YOU
        WILL HAVE NO ACCESS TO YOUR WALLET. YOU ARE SOLELY RESPONSIBLE FOR SAFEGUARDING YOUR SEED
        PHRASE.
        <br />
        <br />
        <strong>2. GPLv3.</strong> The Software is provided under the GNU General Public License
        version 3.0 (“GPLv3”), a copy of which is available at
        https://opensource.org/licenses/GPL-3.0, as supplemented by Sections 3 and 7-9 of the Terms.
        <br />
        <br />
        <strong>3. No Trademark License.</strong> You acknowledge and agree that, notwithstanding
        the terms of GPLv3, neither these Terms nor the terms of GPLv3 provide you with any right or
        license to use any trade name, trademark, service mark or other indicator of Blockstack or
        any of its affiliates, and you agree not to use any Blockstack trade name, trademark or
        service mark without Blockstack’s express written consent.
        <br />
        <br />
        <strong>4. Term; Termination.</strong> These Terms are effective beginning when you accept
        the Terms or first download, install, access, or use the Software, and ending when you cease
        all use of the Software. Sections 7, 8, 9, and 11 will survive termination.
        <br />
        <br />
        <strong>5. Third Party Linked Websites.</strong> Blockstack may provide tools through the
        Software that enable you to export information to third party services. By using one of
        these tools, you agree that Blockstack may transfer that information to the applicable third
        party service. Third party services are not under Blockstack’s control, and, to the fullest
        extent permitted by law, Blockstack is not responsible for any third party service’s use of
        your exported information. The Software may also contain links to third party websites.
        Linked websites are not under Blockstack’s control, and Blockstack is not responsible for
        their content.
        <br />
        <br />
        <strong>6. Modification of the Software.</strong> Blockstack reserves the right to modify or
        discontinue the Software at any time (including by limiting or discontinuing certain
        features of the Software), temporarily or permanently, without notice to you. Blockstack
        will have no liability for any change to the Software.
        <br />
        <br />
        <strong>7. Indemnity.</strong> To the fullest extent permitted by law, you are responsible
        for your use of the Software, and you will defend and indemnify Blockstack and its officers,
        directors, employees, consultants, affiliates, subsidiaries and agents (together, the “
        <strong>Blockstack Entities</strong>”) from and against every claim brought by a third
        party, and any related liability, damage, loss, and expense, including reasonable attorneys’
        fees and costs, arising out of or connected with: (a) your unauthorized use of, or misuse
        of, the Software; (b) your violation of any portion of these Terms, any representation,
        warranty, or any applicable law or regulation; (c) your violation of any third party right,
        including any intellectual property right or publicity, confidentiality, other property, or
        privacy right; or (d) any dispute or issue between you and any third party, including
        without limitation for any liability arising from contractual assumptions of liability made
        by you to a third-party in connection with a conveyance of the Software or a modified
        version of the Software to such third-party. We reserve the right, at our own expense, to
        assume the exclusive defense and control of any matter otherwise subject to indemnification
        by you (without limiting your indemnification obligations with respect to that matter), and
        in that case, you agree to cooperate with our defense of those claims.
        <br />
        <br />
        <strong>8. Disclaimers; No Warranties</strong>
        <br />
        <br />
        THE SOFTWARE AND ALL MATERIALS AND CONTENT AVAILABLE THROUGH THE SOFTWARE ARE PROVIDED “AS
        IS” AND ON AN “AS AVAILABLE” BASIS. BLOCKSTACK DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER
        EXPRESS OR IMPLIED, RELATING TO THE SOFTWARE AND ALL MATERIALS AND CONTENT AVAILABLE THROUGH
        THE SOFTWARE, INCLUDING: (A) ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, OR NON-INFRINGEMENT; AND (B) ANY WARRANTY
        ARISING OUT OF COURSE OF DEALING, USAGE, OR TRADE. BLOCKSTACK DOES NOT WARRANT THAT THE
        SOFTWARE OR ANY PORTION OF THE SOFTWARE, OR ANY MATERIALS OR CONTENT OFFERED THROUGH THE
        SOFTWARE, WILL BE UNINTERRUPTED, SECURE, OR FREE OF ERRORS, VIRUSES, OR OTHER HARMFUL
        COMPONENTS, AND BLOCKSTACK DOES NOT WARRANT THAT ANY OF THOSE ISSUES WILL BE CORRECTED.
        <br />
        <br />
        NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM THE SOFTWARE OR
        BLOCKSTACK ENTITIES OR ANY MATERIALS OR CONTENT AVAILABLE THROUGH THE SOFTWARE WILL CREATE
        ANY WARRANTY REGARDING ANY OF THE BLOCKSTACK ENTITIES OR THE SOFTWARE THAT IS NOT EXPRESSLY
        STATED IN THESE TERMS. WE ARE NOT RESPONSIBLE FOR ANY DAMAGE THAT MAY RESULT FROM THE
        SOFTWARE. YOU ARE SOLELY RESPONSIBLE FOR RECORDING AND SAFEGUARDING YOUR KEYS AND SEED
        PHRASE. YOU UNDERSTAND AND AGREE THAT YOU USE ANY PORTION OF THE SOFTWARE AT YOUR OWN
        DISCRETION AND RISK, AND THAT WE ARE NOT RESPONSIBLE FOR ANY DAMAGE TO YOUR PROPERTY
        (INCLUDING YOUR COMPUTER SYSTEM OR MOBILE DEVICE USED IN CONNECTION WITH THE SOFTWARE) OR
        ANY LOSS OF DATA, INCLUDING STACKS TOKENS.
        <br />
        <br />
        THE LIMITATIONS, EXCLUSIONS AND DISCLAIMERS IN THIS SECTION APPLY TO THE FULLEST EXTENT
        PERMITTED BY LAW. Blockstack does not disclaim any warranty or other right that Blockstack
        is prohibited from disclaiming under applicable law.
        <br />
        <br />
        <strong>9. Limitation of Liability</strong>
        <br />
        <br />
        TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL THE BLOCKSTACK ENTITIES BE LIABLE
        TO YOU FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES (INCLUDING
        DAMAGES FOR LOSS OF PROFITS, GOODWILL, OR ANY OTHER INTANGIBLE LOSS) ARISING OUT OF OR
        RELATING TO YOUR ACCESS TO OR USE OF, OR YOUR INABILITY TO ACCESS OR USE, THE SOFTWARE, YOUR
        KEYS, STACKS TOKENS, OR ANY MATERIALS OR CONTENT ON THE SOFTWARE, WHETHER BASED ON WARRANTY,
        CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY, AND WHETHER OR
        NOT ANY BLOCKSTACK ENTITY HAS BEEN INFORMED OF THE POSSIBILITY OF DAMAGE.
        <br />
        <br />
        TO THE FULLEST EXTENT PERMITTED BY LAW, THE AGGREGATE LIABILITY OF THE BLOCKSTACK ENTITIES
        TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE USE OF OR ANY INABILITY TO USE ANY
        PORTION OF THE SOFTWARE OR OTHERWISE UNDER THESE TERMS, WHETHER IN CONTRACT, TORT, OR
        OTHERWISE, IS LIMITED TO $100.
        <br />
        <br />
        EACH PROVISION OF THESE TERMS THAT PROVIDES FOR A LIMITATION OF LIABILITY, DISCLAIMER OF
        WARRANTIES, OR EXCLUSION OF DAMAGES IS INTENDED TO AND DOES ALLOCATE THE RISKS BETWEEN THE
        PARTIES UNDER THESE TERMS. THIS ALLOCATION IS AN ESSENTIAL ELEMENT OF THE BASIS OF THE
        BARGAIN BETWEEN THE PARTIES. EACH OF THESE PROVISIONS IS SEVERABLE AND INDEPENDENT OF ALL
        OTHER PROVISIONS OF THESE TERMS. THE LIMITATIONS IN THIS SECTION 9 WILL APPLY EVEN IF ANY
        LIMITED REMEDY FAILS OF ITS ESSENTIAL PURPOSE.
        <br />
        <br />
        <strong>10. Privacy Policy.</strong> Please read the Blockstack Privacy Policy, a copy of
        which is available at https://blockstack.org/legal/privacy-policy, carefully for information
        relating to our collection, use, storage, disclosure of your personal information. The
        Blockstack Privacy Policy is incorporated by this reference into, and made a part of, these
        Terms.
        <br />
        <br />
        <strong>11. Miscellaneous.</strong> You may not assign or transfer these Terms or your
        rights under these Terms, in whole or in part, by operation of law or otherwise, without our
        prior written consent. We may assign these Terms at any time without notice or consent. The
        failure to require performance of any provision will not affect our right to require
        performance at any other time after that, nor will a waiver by us of any breach or default
        of these Terms, or any provision of these Terms, be a waiver of any subsequent breach or
        default or a waiver of the provision itself. If any part of these Terms is held to be
        invalid or unenforceable, the unenforceable part will be given effect to the greatest extent
        possible, and the remaining parts will remain in full force and effect. These Terms are
        governed by the laws of the State of New York without regard to conflict of law principles.
        You and Blockstack submit to the personal and exclusive jurisdiction of the state courts and
        federal courts located within New York County, New York for resolution of any lawsuit or
        court proceeding permitted under these Terms. We are under no obligation to provide support
        for the Software. In instances where we may offer support, the support will be subject to
        published policies.
        <br />
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
